import { HotTable } from "@handsontable/react";
import { Button } from "antd";
import Handsontable from "handsontable";
import { registerLanguageDictionary, zhCN } from "handsontable/i18n";
import React from "react";
import ReactDOM from "react-dom";
import "../../../node_modules/handsontable/dist/handsontable.full.css";
import licenseGen from "../../utils/licenseGen";
import ModalEdit from "./ModalEdit";
registerLanguageDictionary(zhCN);

export default class App extends React.Component {
  modal = undefined;

  hotTable = undefined;

  hotSettings = {
    // data: Handsontable.helper.createSpreadsheetData(10, 10),
    startRows: 20,
    startCols: 20,
    colHeaders: false,
    contextMenu: true,
    autoRowSize: false,
    autoColumnSize: false,
    mergeCells: JSON.parse(localStorage.getItem("mergeCells") || "[]"),
    language: zhCN.languageCode,
    // readOnly: true,
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    cell: JSON.parse(localStorage.getItem("cell")) || undefined,
    // editor: true,
    ...JSON.parse(localStorage.getItem("initConfig") || "{}"),
    cells: function (row, col, prop) {
      const cellProperties = { readOnly: false };
      const visualRowIndex = this.instance.toVisualRow(row);
      const visualColIndex = this.instance.toVisualColumn(col);

      if (visualRowIndex === 0 && visualColIndex === 0) {
        cellProperties.readOnly = true;
        this.renderer = (
          instance,
          td,
          row,
          col,
          prop,
          value,
          cellProperties
        ) => {
          console.log("value", td, row, col, prop, value, cellProperties);

          const child = <ModalEdit>{1231231}</ModalEdit>;
          // Handsontable.dom.empty(td);
          // ReactDOM.render(child, td);
          Handsontable.dom.addEvent(td, "click", function (event) {
            this.modal?.setState({
              visible: true,
            });
          });
          td.innerHTML = value;

          return td;
        };
      }

      return cellProperties;
    },
    licenseKey: licenseGen(), //license,必要,由生成器生成
  };

  save = () => {
    const tableData = this.hotTable?.hotInstance
      .getCellsMeta()
      .map(({ instance, ...rest }) => ({ ...rest }));

    const mergeCells = tableData.filter((el) => el.rowspan || el.colspan);
    const cell = tableData.filter((el) => el.className);
    const initConfig = {
      startRows: this.hotTable?.hotInstance.countRows(),
      startCols: this.hotTable?.hotInstance.countCols(),
    };
    const data = this.hotTable?.hotInstance.getData();
    localStorage.setItem("mergeCells", JSON.stringify(mergeCells));
    localStorage.setItem("initConfig", JSON.stringify(initConfig));
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("cell", JSON.stringify(cell));
    console.log("data", cell);
  };

  render() {
    return (
      <>
        <Button onClick={this.save}>保存</Button>
        <HotTable
          id="hot"
          ref={(hotTable) => {
            this.hotTable = hotTable;
          }}
          settings={this.hotSettings}
        />
        <ModalEdit
          ref={(ref) => {
            this.modal = ref;
          }}
        />
      </>
    );
  }
}
