FROM node:12-alpine as base

WORKDIR /usr/share/app
COPY yarn.lock package.json ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build youtube-dl --prod & \
    yarn build api --prod & \
    wait

FROM nginx:1.17 as build_youtube_dl
COPY --from=base /usr/share/app/dist/apps/youtube-dl /usr/share/nginx/html

FROM base as build_api
RUN apk add ffmpeg lame curl python && \
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/bin/youtube-dl && \
    chmod +x /usr/bin/youtube-dl
EXPOSE 3333
