$(function() {
    $.get("data.json?date=" + Date.now(), function(data) {
        // データ加工処理
        data.forEach(element => {
            // 素材データ変換
            element.MaterialText =  element.Material.split(",").map(material => {
                return `<span style="display:inline-block; margin-right:10px;">${material.replaceAll("/", "×")}</span>`;
            }).join("");

            // リアクションデータ変換
            element.ReactionData = {
                text: null,
                image: null,
            };
            if (element.Reaction == "") {
                element.ReactionData.text = "なし";
            } else if (element.Reaction == "？？？") {
                element.ReactionData.text = element.Reaction;
            } else if (element.Reaction.includes("\[")) {
                // 組み合わせ変換処理
                var reactions = [];
                if (!element.Reaction.startsWith("[")) {
                    reactions.push(element.Reaction.split(",\[")[0]);
                }
                element.Reaction.match(/\[.*?\]/g).forEach(group => {
                    group = group.replaceAll("\[", "").replaceAll("\]", "");
                    combinations = combination(group.split(","));
                    reactions.push(combinations);
                });
                element.Reaction = reactions.toString();
            }
            // アイコン画像変換処理
            if (element.Reaction != "" && element.Reaction != "？？？") {
                element.ReactionData.image =  element.Reaction.split(",").map(reaction => {
                    return `<span style="display:inline-block; margin:1px;">` + reaction.split("+").map(reaction2 => {
                        return `<img width="26px" draggable="false" src="${baseUrl}${iconmap.get(reaction2)}.png">`;
                    }).join("+") + `</span>`;
                }).join("");
            } else {
                element.ReactionData.image = element.Reaction;
            }
            // 表記変換処理
            element.ReactionData.text = convertUnit(element.Reaction);

            // タグデータ変換
            if (element.Tag == "") {
                element.TagText = element.Tag;
            } else {
                element.TagText = element.Tag.split(",").map(tag => {
                    return `<button type="button" class="btn btn-sm btn-light me-1" onclick="search(this.innerText)">${tag}</button>`;
                }).join("");
            }
        });
        // 詳細検索条件用データ生成
        const searchOptions = {
            // 検索条件：カテゴリ
            categories: Array.from(categories).map(key => {
                return {
                    label: key,
                    data: `^${DataTable.util.escapeRegex(key).replaceAll("/すべて", "/.+")}$`,
                }
            }),
            // 検索条件：リアクション
            reactions: Array.from(iconmap.keys()).map(key => {
                return {
                    label: `<img width="26px" draggable="false" src="${baseUrl}${iconmap.get(key)}.png">`,
                    data: `${DataTable.util.escapeRegex(convertUnit(key))}`,
                }
            }),
            // 検索条件：タグ
            tags: function() {
                const tags = new Set(series);
                data.forEach(element => {
                    element.Tag.split(",").forEach(tag => {
                        if (tag !== "") {
                            tags.add(tag);
                        }
                    });
                });
                return Array.from(tags.values()).map(tag => {
                    return {
                        label: tag,
                        data: DataTable.util.escapeRegex(tag),
                    }
                });
            }(),
        };
        // テーブル作成
        var table = $("#contents").DataTable({
            data: data,
            columns: [
                {
                    data: "No",
                    searchable: false,
                    searchPanes: {
                        show: false
                    },
                },
                {
                    data: "Name",
                    searchPanes: {
                        show: false
                    },
                },
                {
                    data: "Category",
                    searchPanes: {
                        show: false
                    },
                },
                {
                    data: "MaterialText",
                    searchPanes: {
                        show: false
                    },
                },
                {
                    data: "ReactionData",
                    searchPanes: {
                        show: false
                    },
                    render: {
                        _: "text",
                        filter: "text",
                        display: "image",
                    },
                },
                {
                    data: "TagText",
                    searchPanes: {
                        show: false
                    },
                },
            ],
            info: false,
            pageLength: 100,
            fixedHeader: true,
            scrollY: '80vh',
            searchDelay: 25,
            responsive: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.2.2/i18n/ja.json",
                searchPanes: {
                    title: {
                        _: "詳細検索パネル",
                    },
                    collapse: {
                        _: "詳細検索",
                    },
                    clearMessage: "すべて解除",
                    emptyMessage: "(データなし)",
                },
                paginate: {
                    next: ">",
                    previous: "<",
                    last: ">>",
                    first: "<<",
                }
            },
            layout: {
                topEnd: [
                    function() {
                        return `
                            <div>絞り込み:
                                ${createDetailSearchForm({
                                    name: "category",
                                    label: "カテゴリ",
                                    options: searchOptions.categories,
                                    searchTargetColumn: 2,
                                    width: "600px",
                                })}
                                ${createDetailSearchForm({
                                    name: "reaction",
                                    label: "リアクション",
                                    options: searchOptions.reactions,
                                    searchTargetColumn: 4,
                                    width: "600px",
                                })}
                                ${createDetailSearchForm({
                                    name: "tag",
                                    label: "タグ",
                                    options: searchOptions.tags,
                                    searchTargetColumn: 5,
                                    width: "800px",
                                })}
                            </div>
                        `;
                    },
                    {
                        search: {},
                    },
                    function() {
                        return `<button class="btn btn-outline-secondary rounded-circle fs-6 p-0" style="width:25px; height:25px;" data-bs-toggle="modal" data-bs-target="#helpModal">？</button>`;
                    }
                ],
                bottomStart: [
                    function() {
                        return `© SEGA / © Colorful Palette Inc. / © Crypton Future Media, INC. www.piapro.net All rights reserved.</p>`;
                    },
                ],
            },
        });
        table.on("page", function() {
            $(".dt-scroll-body").scrollTop(0);
        });
        // 変更履歴テーブル作成
        var table = $("#histories").DataTable({
            data: histories.reverse(),
            columns: [
                {
                    data: "date",
                },
                {
                    data: "desc",
                },
            ],
            info: false,
            paging: false,
            searching: false,
            ordering: false,
        });
    });
});

// 組み合わせ変換用関数
function combination(params) {
    let array1 = params;
    let arrayInit = [];
    let i, j,array2;

    for(i = 0;i < array1.length; i++){
        array2 = array1.slice(i + 1)
        for(j = 0; j < array2.length; j++) {
            arrayInit.push([array1[i]].concat([array2[j]]))
        }
    }
    result = [];
    arrayInit.forEach(element => {
        result.push(element[0] + "+" + element[1]);
    });
    return result.toString();
}

// タグ検索用イベントハンドラ
function search(value) {
    if ($("#dt-search-0")[0].value.includes(value)) {
        return;
    }
    $("#dt-search-0")[0].value = ($("#dt-search-0")[0].value + " " + value).trim();
    $("#dt-search-0").trigger("keyup");
}

// ユニット識別子変換関数
function convertUnit(value) {
    value = value.replaceAll("メイコ", "MEIKO").replaceAll("カイト", "KAITO");
    return value;
}

// 絞り込み検索処理
function detailSearch(data) {
    const searchTargetColumn = $(data).attr("search-target-column");
    const searchType = $(`input[type="radio"][search-target-column="${searchTargetColumn}"]:checked`).val();
    const condition = $.map($(`button.active[search-target-column="${searchTargetColumn}"]`),
        function(value) {
            return $(value).attr("search-data");
        }
    ).join(searchType === "and" ? " " : searchType === "or" ? "|" : "\\+");
    $("#contents").DataTable().column(searchTargetColumn).search(condition, true, true).draw();
}

// 絞り込み検索解除処理
function detailSearchClear(data) {
    const searchTargetColumn = $(data).attr("search-target-column");
    $(`button.active[search-target-column="${searchTargetColumn}"]`).removeClass("active");
    $("#contents").DataTable().column(searchTargetColumn).search("").draw();
}

// 絞り込み検索フォーム構築処理
function createDetailSearchForm(formData) {
    const dropdownOpts = `class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"`;
    const dropdownMenuOpts = `name="dropdown-${formData.name}" class="dropdown-menu dropdown-menu-end p-2" style="width:${formData.width}"`;
    const buttonsOpts = `class="btn btn-sm btn-light m-1" data-bs-toggle="button" search-target-column="${formData.searchTargetColumn}" onclick="detailSearch(this)"`;
    const clearButtonOpts = `class="btn btn-sm btn-light m-1" search-target-column="${formData.searchTargetColumn}" onclick="detailSearchClear(this)"`;
    const switchFormOpts = `class="form-check form-check-inline"`;
    const switchButtonsOpts = `class="form-check-input" type="radio" name="${formData.name}SearchSwitch" search-target-column="${formData.searchTargetColumn}" onclick="detailSearch(this)"`;
    const switchLabelsOpts = `class="form-check-label"`;
    return `
        <div class="btn-group">
            <button ${dropdownOpts}>${formData.label}</button>
            <div ${dropdownMenuOpts}>
                <div>${formData.label}検索</div>
                ${formData.options.map(option => {
                    var result = ``;
                    if (option.label.startsWith("<img") && option.label.match("0[2-5]_1_")) {
                        result += "<br>";
                    }
                    if (option.label.startsWith("<img") && option.label.match("0[1-5]_1_")) {
                        result += `<img src="https://pjsekai.sega.jp/assets/data/webp/character/unite${option.label.match("(0[1-5])")[0]}/logo.png.webp" width="80px">`;
                    }
                    result += `<button ${buttonsOpts} search-data="${option.data}">${option.label}</button>`
                    return result;
                }).join("")}
                <hr class="dropdown-divider">
                <button ${clearButtonOpts}>すべて選択解除</button>
                <div ${switchFormOpts}>
                    <input ${switchButtonsOpts} id="${formData.name}SearchSwitchAnd" value="and" checked>
                    <label ${switchLabelsOpts} for="${formData.name}SearchSwitchAnd">AND検索</label>
                </div>
                <div ${switchFormOpts}>
                    <input ${switchButtonsOpts} id="${formData.name}SearchSwitchOr" value="or">
                    <label ${switchLabelsOpts} for="${formData.name}SearchSwitchOr">OR検索</label>
                </div>
                <div ${switchFormOpts} ${formData.name === "reaction" ? "" : "hidden"}>
                    <input ${switchButtonsOpts} id="${formData.name}SearchSwitchMulti" value="multi">
                    <label ${switchLabelsOpts} for="${formData.name}SearchSwitchMulti">複数人リアクション検索</label>
                </div>
            </div>
        </div>
    `;
}