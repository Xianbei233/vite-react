import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import React from "react";
import "../../../node_modules/handsontable/dist/handsontable.css";
import licenseGen from "../../utils/licenseGen";

export default class App extends React.Component {
  hotTable = undefined;

  hotSettings = {
    colHeaders: false,
    contextMenu: true,
    autoRowSize: false,
    autoColumnSize: false,
    mergeCells: true,
    language: "zh-CN",
    licenseKey: licenseGen(), //license,必要,由生成器生成
  };

  render() {
    return (
      <HotTable
        id="hot"
        ref={(hotTable) => {
          this.hotTable = hotTable;
        }}
        settings={this.hotSettings}
        data={Handsontable.helper.createSpreadsheetData(20, 20)}
        language="zh-CN"
        hotInstance={}
      />
    );
  }
}
