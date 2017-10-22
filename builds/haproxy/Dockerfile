FROM haproxy:latest

COPY /etc/letsencrypt/live/wehpu.jeneser.wang/fullchain.pem /etc/ssl/certs/fullchain.pem

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
