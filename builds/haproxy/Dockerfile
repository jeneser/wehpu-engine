FROM haproxy:latest

# cat fullchain.pem privkey.pem > /root/workspace/wehpu-engine/builds/haproxy/wehpu.jeneser.wang.pem
COPY wehpu.jeneser.wang.pem /usr/local/etc/haproxy/wehpu.jeneser.wang.pem

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
