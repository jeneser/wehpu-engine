/**
 * 新闻网配置
 * http://news.hpu.edu.cn
 */
var config = {
  // cheerio配置
  cheerioConfig: {
    // True 屏蔽不规范源码
    xmlMode: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    ignoreWhitespace: true
  },

  // 限制最大并发数量
  limit: 5,

  // 综合新闻URL
  url: 'http://news.hpu.edu.cn/SiteFiles/Inner/dynamic/output.aspx?publishmentSystemID=543&word=+&pageNodeID=544&pageContentID=0&pageTemplateType=ChannelTemplate&isPageRefresh=False&pageUrl=98CL0evdPiTY1bMSnVtpnv1ehO4X1GqCF40add0d3Me0add0cafhmC4KazBNBUDJr0slash0AeZOpP&ajaxDivID=ajaxElement_2&templateContent=5h27Jd1Xe0slash0q4uWDOaLlj7476vGbIBdgj4B3RtCTmck6ODrN0add0wGn0slash05qol0slash0b1eo2sXSUD0slash0cq60slash0B4xUpRRC5qFhogEaEh3M0add0eVgXv4yw0iI3kLW4aomo1Fwsf0slash0cxWejcOFyA474fOGa2KyQkBeDi2dMJhskvtPW2VnuyMgTKHJW6gzo8BLcsWVBeWYmDuOh0add0PiZYLPAM0add0yphuSNrar2zNiLZrza54amFZ2PWFRGfzAeF3UA3WGWJf3K6USZCQZJlXSdQ5vAmixNNLXLL3X0DISUq0slash0h54o6j56VTcqvqjNtPNeIz0add0aJmxCjRiu3hW33LOlR8VCqfnwqV5ArODdyrJRTLICw30slash0cXJp1hXN56swks0add0CQfUIQmGIEHqJZNY0add06PafRRySctY46wycjNUvQop0slash01mefXPWaqUn6TYE3JTlit6csjNW9LMAgwjTAkmMxNdIjn729ngREKM6xGlp0slash0zjGLJGNntFmglWyEApkGxLyMaMbLFsbKS1rTjDajQ7gVh0dxQeNUdpkPE0JwmLDJyfOVFMAd9zgdDEebvqAB4Zzrr9PTqkEIAcQfhmaUpAmrcH56oZHGvPaTK3kDECTrV7C0xfw8kDpC4nXFD5813FrCm4ZCLBOu0slash0LiEAJJ02duuQ0add0UTipJ2OPkYFWKh0add04ilmeVlSk1ICg9iRjqtdUnVsTr6sJbS14HuglXDuWal5yJPL3RrsSgm0add0IJjG6HNATxlynfQUcMgSdkhHQVeAwfFkEUDO3yzyEqC0slash0pJiCDd1CCMtbGUYPhDiZWhJ0slash0FDEQmSEuIwyisgtVE2BkVyKxFlWXWTAJdW2YjmTF7D3twwcWJ3dU7u0w9nUZX62wtf5Q0add0ztokZbvn9F2Ln1l1ddFMA0slash0iKeU84feD0add0l3kSKsOsLw4tTGLntFYYDlQFRuJr0add0MWl54juPvdQIRkBmY562quYOnztPH8GpetgnbDZSzHoWDHkqmVjYycZ5xZOJV12qwRmcqtt8AQFQzfCY6Ta8yr79ndD0slash0VY1M8fXmwKDGHzWNdjw2PuoSwAzuaUEDE7oZwVr3SvE3jZ3wmNKr0bLvuWUBOLzJvn1J5sndpgbsUqNBfed15dVtJjDmleNWHryoYQlO98CwnCpovpGnZ11ClPBKN6Yy0add0ejL0add0V3p5muSHV0slash0Gtl0cIcs7C0add0LZIU0add04fD6bvQ6PdBOicSGTJrDqRwyp9cPOUGSk553tD41GEhdQoQxMrvFbvq5Q10ydH7LsZvKJGbkV0slash0J2p0slash0uXMmie0slash0z5dxQhL5idLhzlypYnjLonTpHrQ9gcH2Ldz07WeFBVGwN2YDiei0slash05xoLmRkFqjie0add0ldE0FrYA2KeBQpXsv9Q9PZ1S8IFekl2ezSvq55T0add08jgROyN24wgMDtu9FQJ6v7XuG4tNr0slash0nNVrgHRxM15x6eaLqc7oX0slash07NkXdpBTcYUjMb0add0MzXS26OAEKo5KV05wZZDbqyiwYzqxAUSWN89kpwH0add0R59ReOeGd7Am7mftHcXJ6VuSEjlQWNGHA5s2EhZWWfwV9Ph3TMI1FsmgTUg90slash0WG2viqQwJhS0Kc9NXg9Itf35i9HCoTrE2GAyljFv10GEBQDDZ5hZcFyZpwuwLrKG6ps7Z50add0P0slash0LEgO8foY6DazFAFduj40add0k2VfZAlpdxeDvBDYvAQfzmgJ0Hody9w7MI5fJ7KmeyW77XJKdezDfKAyqM05dIVES0add0Zd0add0Cr4UM40x0slash00gvHKFZS83cyMg5Y2g1xNCxJfZ0u6DThFpxrkmkbu5Yg0slash00myyfvzRfCdZr5m0slash0PxFuNZAXXKsV7vk19RYEaJrs1feT4WXrYfdgkl8kVhZQ0slash0Gvp7K8PDB0SKeQYgFbta24G4GiA5qbtNUThzx4eAcwoWHqNI8hDYQakqKKLdOs1wop2fPYi92fH4qR2FkZJgKVb07U9KnS3K3y2b5aoRrxn1hNtTzON30slash0BiVjF0KuEFBk0slash0nNWk1rlqgaff67n0slash03SI7Iof7zZidMi0eA9XgDBqqCDYlfmpWQcGunMLEyfEn8XZdxJbcyY0slash0ujh1JCcteN6pcrKeEQplt0add0Cv8EZfWkrNd8GPDtat90add00C7jrvSVsDfTShmxJW60add09qFctlJcsemNU0add04GiFShQ6kx0slash00slash02dtt0add0jT4v6NrcX57F0slash0QwKCLXmgMhcJf0add0tShyF9FULhZBqAC7U885dwE2YHbF2grggPOksqwq3kcfBoGFsHvqN9xiS2srhfkpheIn0jQm9wJHrt9aLoyBX8n78I4NDhvprBHEFxQMavwkBpMZjZC1IlmxmkemmG7Gq1iFA44QdnHdRreY5af1VPYhIOIgPH0NadOc7bSsq678Nr2jTD94YvVtOnvgw3pCdgrPpDiX3r0slash0Po9MWqbCldxUGvXRHXObzK0slash0yzahd0UubxPeDwYlPJ0add0P6cEiH0add0yAMaWnh1NtWMspkAqEz80slash0wV2VQ28d7QkZHHQ4EGka3q7wYf8nsdLQsh651J0add0DhaORbNfvYyoj4DYNh0slash0i1wYhYFRprVxyfyHbnArHI4wEOfo0D1DTx2Gjj3L4NJS0add0goM4pyhfPxxWY4GKqGi7Qhcg8qvMhvWaLIrO4VD0slash0sS9EL38jlE7JRfRbnuc7b3fRwaFZHL10add0NmUMWsCNlhXA7PfXGnT0add0dayW5B0add0fb8n3TFO2zdXFcsuHGfSVGpYWNqk7kGF0slash0GHEjz1FHM6QsHVIAbN0slash0vaouwog0equals00equals0&pageNum=1',

  // 请求头
  headers: {
    Accept: '*/*',
    Origin: 'http://news.hpu.edu.cn',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/53.0.2785.143 Chrome/53.0.2785.143 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    DNT: 1,
    Referer: 'http://news.hpu.edu.cn/news/channels/694.html',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6'
  }
}

module.exports = config;