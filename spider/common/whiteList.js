// 允许上传的MIME类型
const mimeWhiteList = [
  {
    mime: 'application/msword',
    ext: 'doc'
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ext: 'docx'
  },
  {
    mime: 'application/pdf',
    ext: 'pdf'
  },
  {
    mime: 'application/vnd.ms-excel',
    ext: 'xls'
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ext: 'xlsx'
  },
  {
    mime: 'application/zip',
    ext: 'zip'
  },
  {
    mime: 'application/x-rar-compressed',
    ext: 'rar'
  },
  {
    mime: 'image/jpeg',
    ext: 'jpeg, jpg'
  },
  {
    mime: 'image/gif',
    ext: 'gif'
  },
  {
    mime: 'image/png',
    ext: 'png'
  }
];

module.exports = mimeWhiteList;