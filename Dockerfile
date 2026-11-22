# Written by blitz.cloud for this project. It is yours now: blitz.cloud
# builds from it as it is, and you can change it like any other file.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --chown=1000:1000 *.html /usr/share/nginx/html/
COPY --chown=1000:1000 css ./css
COPY --chown=1000:1000 js ./js
COPY --chown=1000:1000 images ./images

WORKDIR /usr/share/nginx/html
COPY --chown=1000:1000 css /usr/share/nginx/html/css
COPY --chown=1000:1000 js /usr/share/nginx/html/js
COPY --chown=1000:1000 images /usr/share/nginx/html/images

ENV PORT=8080
EXPOSE 8080

USER 1000:1000

CMD ["nginx", "-g", "daemon off;"]
