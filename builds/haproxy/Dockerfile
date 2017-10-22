FROM haproxy:latest

COPY fullchain.pem /etc/ssl/certs/fullchain.pem

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
