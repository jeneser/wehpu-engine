FROM haproxy:latest

COPY fullchain.pem /usr/local/etc/haproxy/fullchain.pem

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
