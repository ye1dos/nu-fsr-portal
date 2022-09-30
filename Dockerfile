FROM node:10.16-buster-slim AS build

COPY . /app
WORKDIR /app

ARG ENV
RUN echo "REACT_APP_ENV=${ENV}" > .env &&\
    cat .env

RUN npm install && npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN apk --no-cache add tzdata && cp /usr/share/zoneinfo/Asia/Almaty /etc/localtime
RUN echo '10.130.100.2 sandbox.almanit.kz prodport.almanit.kz' >> /etc/hosts

# Expose ports
EXPOSE 80 443

# Entry point
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
