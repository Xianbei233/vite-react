import { HotTable } from "@handsontable/react";
import { Button } from "antd";
import Handsontable from "handsontable";
import { registerLanguageDictionary, zhCN } from "handsontable/i18n";
import React from "react";
import "../../../node_modules/handsontable/dist/handsontable.full.css";
import licenseGen from "../../utils/licenseGen";
import ModalEdit from "./ModalEdit";
registerLanguageDictionary(zhCN);

let componentInstance;

export default class App extends React.Component {
  constructor(props: Props) {
    super(props);
    componentInstance = this;
  }

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
    editor: false,
    readOnly: true,
    // readOnly: true,
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    cell: JSON.parse(localStorage.getItem("cell")) || undefined,
    // editor: true,
    ...JSON.parse(localStorage.getItem("initConfig") || "{}"),
    licenseKey: licenseGen(), //license,必要,由生成器生成
  };

  cellRenderer = function (row, col, prop) {
    const cellProperties = { readOnly: false };

    cellProperties.renderer = (
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties
    ) => {
      console.log("123123");
      // Handsontable.dom.empty(td);
      // ReactDOM.render(child, td);
      Handsontable.dom.addEvent(td, "click", (e) => {
        console.log("eeee");
        console.log("instance", componentInstance.modal);
        componentInstance.modal?.setState({
          visible: true,
        });
      });
      td.innerHTML = value;

      return td;
    };

    return cellProperties;
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
          cells={this.cellRenderer}
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
