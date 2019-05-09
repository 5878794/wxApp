//input自动赋值到 Page的data对象上，


//input的id需要对应data里面到key
//input需要添加事件 bindinput='setInputVal'
let setInputVal = function (e) {
  let id = e.target.id,
      val = e.detail.value,
      newObj = {};

  newObj[id] = val;
  this.setData(newObj);
};


module.exports = setInputVal;