import jspreadsheet from "jspreadsheet-ce";
import React, { useEffect, useRef } from "react";
import "../node_modules/jspreadsheet-ce/dist/jexcel.css";

export default function App() {
  const jRef = useRef(null);

  const options = {
    data: [[]],
    minDimensions: [10, 10],
    contextMenu: (obj, x, y, e) => {
      var items = [];

      if (y == null) {
        // Insert a new column
        if (obj.options.allowInsertColumn == true) {
          items.push({
            title: obj.options.text.insertANewColumnBefore,
            onclick: function () {
              obj.insertColumn(1, parseInt(x), 1);
            },
          });
        }

        if (obj.options.allowInsertColumn == true) {
          items.push({
            title: obj.options.text.insertANewColumnAfter,
            onclick: function () {
              obj.insertColumn(1, parseInt(x), 0);
            },
          });
        }

        // Delete a column
        if (obj.options.allowDeleteColumn == true) {
          items.push({
            title: obj.options.text.deleteSelectedColumns,
            onclick: function () {
              obj.deleteColumn(
                obj.getSelectedColumns().length ? undefined : parseInt(x)
              );
            },
          });
        }

        // Rename column
        if (obj.options.allowRenameColumn == true) {
          items.push({
            title: obj.options.text.renameThisColumn,
            onclick: function () {
              obj.setHeader(x);
            },
          });
        }

        // Sorting
        if (obj.options.columnSorting == true) {
          // Line
          items.push({ type: "line" });

          items.push({
            title: obj.options.text.orderAscending,
            onclick: function () {
              obj.orderBy(x, 0);
            },
          });
          items.push({
            title: obj.options.text.orderDescending,
            onclick: function () {
              obj.orderBy(x, 1);
            },
          });
        }
      } else {
        // Insert new row
        if (obj.options.allowInsertRow == true) {
          items.push({
            title: obj.options.text.insertANewRowBefore,
            onclick: function () {
              obj.insertRow(1, parseInt(y), 1);
            },
          });

          items.push({
            title: obj.options.text.insertANewRowAfter,
            onclick: function () {
              obj.insertRow(1, parseInt(y));
            },
          });
        }

        if (obj.options.allowDeleteRow == true) {
          items.push({
            title: obj.options.text.deleteSelectedRows,
            onclick: function () {
              obj.deleteRow(
                obj.getSelectedRows().length ? undefined : parseInt(y)
              );
            },
          });
        }

        if (x) {
          if (obj.options.allowComments == true) {
            items.push({ type: "line" });

            var title = obj.records[y][x].getAttribute("title") || "";

            items.push({
              title: title
                ? obj.options.text.editComments
                : obj.options.text.addComments,
              onclick: function () {
                obj.setComments(
                  [x, y],
                  prompt(obj.options.text.comments, title)
                );
              },
            });

            if (title) {
              items.push({
                title: obj.options.text.clearComments,
                onclick: function () {
                  obj.setComments([x, y], "");
                },
              });
            }
          }
        }
      }

      // Line
      items.push({ type: "line" });

      // Save
      if (obj.options.allowExport) {
        items.push({
          title: obj.options.text.saveAs,
          shortcut: "Ctrl + S",
          onclick: function () {
            obj.download();
          },
        });
      }

      // About
      if (obj.options.about) {
        items.push({
          title: obj.options.text.about,
          onclick: function () {
            alert(obj.options.about);
          },
        });
      }

      return items;
    },
    columns: [{ width: 10 }],
    text: {
      noRecordsFound: "未找到",
      showingPage: "显示 {1} 条中的第 {0} 条",
      show: "显示 ",
      search: "搜索",
      entries: " 条目",
      columnName: "列标题",
      insertANewColumnBefore: "在此前插入列",
      insertANewColumnAfter: "在此后插入列",
      deleteSelectedColumns: "删除选定列",
      renameThisColumn: "重命名列",
      orderAscending: "升序",
      orderDescending: "降序",
      insertANewRowBefore: "在此前插入行",
      insertANewRowAfter: "在此后插入行",
      deleteSelectedRows: "删除选定行",
      editComments: "编辑批注",
      addComments: "插入批注",
      comments: "批注",
      clearComments: "删除批注",
      copy: "复制...",
      paste: "粘贴...",
      saveAs: "保存为...",
      about: "关于",
      areYouSureToDeleteTheSelectedRows: "确定删除选定行?",
      areYouSureToDeleteTheSelectedColumns: "确定删除选定列?",
      thisActionWillDestroyAnyExistingMergedCellsAreYouSure:
        "这一操作会破坏所有现存的合并单元格，确认操作？",
      thisActionWillClearYourSearchResultsAreYouSure:
        "这一操作会清空搜索结果，确认操作？",
      thereIsAConflictWithAnotherMergedCell: "与其他合并单元格有冲突",
      invalidMergeProperties: "无效的合并属性",
      cellAlreadyMerged: "单元格已合并",
      noCellsSelected: "未选定单元格",
    },
  };

  useEffect(() => {
    if (!jRef.current.jspreadsheet) {
      jspreadsheet(jRef.current, options);
    }
    jRef.current.jspreadsheet.hideIndex();
  }, [options]);

  const addRow = () => {
    jRef.current.jexcel.insertRow();
  };

  const addColumn = () => {
    jRef.current.jexcel.insertColumn();
  };

  return (
    <div>
      <div ref={jRef} />
      <br />
      <input type="button" onClick={addRow} value="Add new row" />
      <input type="button" onClick={addColumn} value="Add new column" />
    </div>
  );
}
