var cheerio = require('cheerio');

/**
 * 处理课表
 * @param {*} data 原始选课结果页面html源码
 * @return {Array} courses 处理结果
 */
exports.course = function (data) {
  // 结果数组
  var courses = [];

  // cheerio配置
  var cheerioConfig = {
    // True 屏蔽urp不规范源码
    xmlMode: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    ignoreWhitespace: true
  }

  // 清理字段工具集
  var Utils = {
    removeBlank(val) {
      return val.replace(/\s/g, '');
    },
    cleanPlace(floor, room) {
      return this.removeBlank(floor.replace(/综合楼|学楼|号|训练|区|地/g, '')) + this.removeBlank(room.replace(/\(多\)/g, ''));
    },
    cleanTime(val) {
      var _time = '';
      switch (this.removeBlank(val)) {
        case '一':
          _time = '1-2';
          break;
        case '三':
          _time = '3-4';
          break;
        case '五':
          _time = '5-6';
          break;
        case '七':
          _time = '7-8';
          break;
        case '九':
          _time = '9-10';
          break;
      }
      return _time;
    },
    cleanWeek(val) {
      return val ? parseInt(this.removeBlank(val)) : '';
    },
    cleanWeekly(val) {
      return val ? val.replace(/\s|周|上/g, '').split(',').map(_weekly => {
        return _weekly.split('-').map(__weekly => {
          return parseInt(__weekly);
        })
      }) : '';
    },
    cleanTeacher(val) {
      return val.replace(/\*/g, '').trim();
    }
  };

  // 处理课表
  $ = cheerio.load(data, cheerioConfig);

  // step1 获取包含课表的<table>块
  var step1 = $('table').eq(7).html();

  // step2 分割课程
  var step2 = step1.toString().split('onmouseover="var');
  step2.splice(0, 1);

  // console.log('step2' + step2[2]);

  // 处理每门课程
  step2.forEach(step2element => {
    // 暂存本门课程
    var course = [];

    // step3 分割本门课程
    var step3 = step2element.split('onmouseout="SF');

    // console.log('step3' + step3[1]);

    // 处理当前单门课程
    step3.forEach((step3element, step3index) => {
      // 去除空白
      var _step3element = step3element.replace(/(&amp;)|(nbsp;)|\s]/ig, '');
      _$ = cheerio.load(_step3element, cheerioConfig);

      // 选择所有<td>标签
      var td = _$('td');

      // console.log('-----' + _step3element + '------');
      // console.log('step3---' + td + '---step3');

      //  第一项位置不同，特殊处理
      if (step3index !== 0) {
        course.push({
          name: course[0].name,
          place: Utils.cleanPlace(td.eq(5).text(), td.eq(6).text()),
          time: Utils.cleanTime(td.eq(2).text()),
          week: Utils.cleanWeek(td.eq(1).text()),
          weekly: Utils.cleanWeekly(td.eq(0).text()),
          teacher: course[0].teacher
        })
      } else {
        course.push({
          // 课程名
          name: Utils.removeBlank(td.eq(2).text()),
          // 地点和教室
          place: Utils.cleanPlace(td.eq(16).text(), td.eq(17).text()),
          // 节次
          time: Utils.cleanTime(td.eq(13).text()),
          // 周几
          week: Utils.cleanWeek(td.eq(12).text()),
          // 周次
          weekly: Utils.cleanWeekly(td.eq(11).text()),
          // 教师
          teacher: Utils.cleanTeacher(td.eq(7).text())
        });
      }
    })

    // 合并数组 apply
    courses.push.apply(courses, course);
  });

  console.log(courses);

  return courses;
}