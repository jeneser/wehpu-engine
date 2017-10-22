FROM haproxy:latest

RUN cp -ri /etc/letsencrypt/live/wehpu.jeneser.wang/* /etc/ssl/certs/

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
