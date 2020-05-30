# Youtube Downloader UI

![Sample picture](docs/assets/page.png)

This project uses the [Nx](https://nx.dev) monorepository tools. 

## Prerequisites
* Download and install [youtube-dl](https://youtube-dl.org/) and 
[ffmpeg](https://ffmpeg.org/) and make sure that both tools are
in your ```PATH``` environment variable. youtube-dl is used for downloading
the content and ffmpeg is responsible for converting the videos in the desired 
format.

## Setup
* First install node.js and the yarn package manager.
    ```bash
    npm install -g yarn
    ```
* Checkout this repository and install all dependencies
    ```bash
    yarn install
    ```
* Open two terminals and start the backend in the first one
    ```bash
    yarn start api
    ```
    and the frontend in the second one
    ```bash
    yarn start youtube-dl
    ```
* Navigate with your browser to [localhost:4200](http://localhost:4200) and that's it.


