var crypto = require('crypto');
var config = require('../config');
var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleScore = require('../common/score');

var User = require('../models/user');

/**
 * 查询空教室
 * @param {String} type 查询类型
 * @param {String} [openId] 包含在token中的openId
 */
exports.score = function (req, res, next) {
  // var openId = req.jwtPayload.openId;
  var type = req.query.type;

  console.log(type)

  if ((type !== 'all') && (type === '')) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  // 查询成绩
  var userInfo = {
    studentId: '311509040120',
    vpnPassWord: '211219',
    jwcPassWord: '311509040120'
  }

  // 查询本学期成绩
  // if (type === 'all') {
  //   Promise.resolve(HPUUrpLogin.login({
  //       studentId: userInfo.studentId,
  //       vpnPassWord: userInfo.vpnPassWord,
  //       jwcPassWord: userInfo.jwcPassWord,
  //       method: 'get',
  //       url: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/bxqcjcxAction.do'
  //     }))
  //     .then(urpContent => {
  //       console.log(urpContent);
  //       var _urpContent = urpContent.text;
  //       if (/本学期成绩/.test(_urpContent)) {
  //         return Promise.resolve(handleScore.score(_urpContent));
  //       } else {
  //         return Promise.reject('访问失败')
  //       }
  //     })
  //     .then(scoreRes => {
  //       console.log(scoreRes)
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }

  var str = '\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n<html>\n<script language="JavaScript" src="/com/svpn_websvc_functions.js" charset="utf-8" sf_script="1"></script>\n<script type="text/vbscript" src="/com/svpn_websvc_functions.vbs" charset="utf-8" sf_script="1"></script><script sf_script="1"></script>\n\r\n\t<head>\r\n\t\t<title></title>\r\n<link href="/web/2/http/1/218.196.240.97/css/newcss/project.css" rel="stylesheet" type="text/css">\r\n\t</head>\r\n\t<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="overflow:auto;">\r\n\t\t<form name="form" method="post">\r\n<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">\r\n<tr><td class="Linetop"></td>\r\n</tr>\r\n</table>\r\n<table width="100%"  border="0" cellpadding="0" cellspacing="0" class="title" id="tblHead">\r\n<tr>\r\n\t\t\t\t\t<td width="80%" >\r\n\t\t\t\t\t<table border="0" align="left" cellpadding="0" cellspacing="0" >\r\n\t\t\t\t\t\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t<td>&nbsp;</td>\r\n\t\t\t\t\t<td valign="middle">&nbsp;<b>本学期成绩查询列表</b>\r\n\t\t\t\t\t&nbsp;</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td width="20%" >\t\t\t\t\t\r\n\t\t\t\t\t\t<table border="0" align="left" cellpadding="0" cellspacing="0" width="100%" >\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td>&nbsp;</td>\t\t\t\t\t\t\r\n\t\t\t\t\t<td width="5"></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n</table>\r\n<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">\r\n<tr><td class="Linetop"></td>\r\n</tr>\r\n</table>\r\n\t\t\t<table width="100%" border="0" cellpadding="0" cellspacing="0" class="titleTop2">\r\n\t\t\t\t\t <tr>\r\n\t\t\t\t\t  <td class="pageAlign">\r\n\t\t\t\t\t   <table cellpadding="0" width="100%" class="displayTag" cellspacing="1" border="0" id="user">\r\n\t\t\t\t\t    <thead>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t<th align="center" width="10%" class="sortable">\r\n\t\t\t\t\t\t课程号\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th align="center" width="6%" class="sortable">\r\n\t\t\t\t\t\t课序号\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th align="center" width="18%" class="sortable">\r\n\t\t\t\t\t\t课程名\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th align="center" width="20%" class="sortable">\r\n\t\t\t\t\t\t英文课程名\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th align="center" width="4%" class="sortable">\r\n\t\t\t\t\t\t学分\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th align="center" width="8%" class="sortable">\r\n\t\t\t\t\t\t课程属性\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<th align="center" width="10%" class="sortable">课程最高分</th>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<th align="center" width="10%" class="sortable">课程最低分</th>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<th align="center" width="10%" class="sortable">课程平均分</th>\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<th align="center" width="4%" class="sortable">成绩</th>\r\n\t\t\t\t\t<th align="center" width="6%" class="sortable">名次</th>\r\n\t\t\t\t\t<th align="center" width="12%" class="sortable">未通过原因</th>\r\n\t\t\t\t</tr>\r\n\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\t<tr class="odd" onMouseOut="var SF_FUNC_cache_flush_tmp=SF_FUNC_cache_flush;this.className=\'even\';SF_FUNC_cache_flush_tmp();" onMouseOver="var SF_FUNC_cache_flush_tmp=SF_FUNC_cache_flush;this.className=\'evenfocus\';SF_FUNC_cache_flush_tmp();">\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t120000011\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t14\t\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t思想政治理论课实践教学\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t2\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t必修\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t  95\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</td><td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t  0\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t    74.23\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t中等\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t \t    </td>\r\n\t\t\t\t\t \t    <td align="center">\r\n\t\t\t\t\t \t    \t\r\n\t\t\t\t\t\t\t\t  2031\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td align="center">\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t \t    </td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\r\n\t\t\t\t\r\n\t\t\t</TABLE>\r\n\t\t</form>\r\n\t</body>\r\n</html>\r\n\n<script language="javascript" sf_script="1">if(typeof(SF_FUNC_Page_End)==\'function\')SF_FUNC_Page_End();</script>';

  handleScore.score(str)
}