# Build distribution for the backend and frontend
FROM node:12-alpine as build_dist
WORKDIR /usr/share/app
COPY yarn.lock package.json .yarnrc packages-cache ./
RUN yarn install --frozen-lockfile --prefer-offline
COPY . .
RUN yarn build youtube-dl --prod & \
    yarn build api --prod & \
    wait

# Build node_modules directory for production use
FROM node:12-alpine as build_modules
WORKDIR /usr/share/app
COPY yarn.lock package.json .yarnrc packages-cache ./
RUN yarn install --frozen-lockfile --prod --prefer-offline && ls node_modules

FROM node:12-alpine as build_youtube_dl
RUN apk add ffmpeg lame curl python && \
    curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/bin/youtube-dl && \
    chmod +x /usr/bin/youtube-dl
WORKDIR /usr/share/app
COPY --from=build_dist /usr/share/app/dist dist
COPY --from=build_modules /usr/share/app/node_modules node_modules
EXPOSE 3333
