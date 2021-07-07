const cellStructure = {
  mergeCells: [], // 记录table的合并格配置，对象数组
  cell: [], // 记录table中cell相关的特殊状态，对象数组
  startCols: 0, // 记录table的col长，init
  startRows: 0, // 记录table的row长，init
  floor: "", // 楼层,string,来自数据字典
};

const dataStructure = {
  row: 0, // 数据所关联的物理row index，init
  col: 0, // 数据所关联的物理col index，init
  seat: "5A12", // 数据所关联的座位号，string
  status: "", // 位置状态，string，双方约定
  team: "", // 所属小组,未知数据来源
  phone: "", // 电话,string
  port: 0 || 1, // 可用端口数量,init
  name: "", // 名称,string
  end_date: "", // 到期时间,string
  floor: "", // 楼层,string,来自数据字典
};
