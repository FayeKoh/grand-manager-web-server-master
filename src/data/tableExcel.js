import * as XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'
function exportExcel(table, title, statisticsDate) {
  const headerDisplay = {
    index: "序号",
    nickname: "账户名称",
    username: "账户昵称",
    email: "电子邮箱",
    role: "用户权限",
    create_time: "创建日期",
  };
  const newData = [headerDisplay, ...table];
  var opt = {
    rowIndex: 0
  }
  var mySheet = XLSX.utils.json_to_sheet(newData, opt, { skipHeader: true });
  mySheet["!merges"] = [{
    s: {//s为开始
      c: 0,//开始列
      r: 0//可以看成开始行,实际是取值范围
    },
    e: {//e结束
      c: 5,//结束列
      r: 0//结束行
    }
  }];
  const Allborder = {
    right: {
      style: "thin",
    },
    bottom: {
      style: "thin"
    }
  }
  mySheet['A1'].v = "GRAND Manager-账户管理-账户列表"
  for (const key in mySheet) {
    if (key == 'A1') {
      mySheet['A1'].s = {
        border: Allborder,
        font: {
          name: '宋体',
          sz: 10,//设置标题的字号
          bold: true,//设置标题是否加粗
        },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },//设置标题水平竖直方向居中，并自动换行展示
        fill: {
          fgColor: { rgb: 'CCFFFF' }//设置标题单元格的背景颜色
        }
      };
    }
    else if (key == 'A2' || key == 'B2' || key == 'C2' || key == 'D2'
      || key == 'E2' || key == 'F2' || key == 'G2' || key == 'H2' || key == 'I2' || key == 'J2' || key == 'K2') {
      mySheet[key].s = {
        border: Allborder,
        font: {
          name: '宋体',
          sz: 10,//设置标题的字号
          bold: true,//设置标题是否加粗
        },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },//设置标题水平竖直方向居中，并自动换行展示
        fill: {
          fgColor: { rgb: 'FFFFCC' }
        }
      }
    }
    else if (key != '!ref') {
      mySheet[key].s = {
        border: Allborder,
        font: {
          name: '宋体',
          sz: 10,//设置标题的字号
          bold: false,//设置标题是否加粗
        },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },//设置标题水平竖直方向居中，并自动换行展示
      }
    }
  }
  mySheet['!cols'] = [
    { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 150 }, { wpx: 80 }, { wpx: 150 }
  ]
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, mySheet, "Sheet1");
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSXStyle.write(wb, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }); // 字符串转ArrayBuffer
  // 导出excel文件 如导出后的文件不能打开，请将后缀替换为 .xls
  openDownloadDialog(blob, 'GRAND Manager-账户管理-账户列表' + '-' + '.xlsx');
}
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
function openDownloadDialog(url, saveName) {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}
export default exportExcel;
