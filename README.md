# stackmate

Stackmate generate screenshots of multiple pages against multiple browsers using [BrowserStack](http://browserstack.com) Screenshot [API](https://www.browserstack.com/screenshots/api).

_You need a browserstack subscription to use these scripts_

## Installation

- clone this repo
- type `npm install` to get the project dependencies
- rename `conf.api.js.sample` to `conf.api.js` and fill in your [BrowserStack](http://browserstack.com) username and api key.
- modify `conf.urls` with the url(s) you want to take screenshot of
- (optional) modify `conf.browsers` with the browsers you want to test against. ([browserstack documentation](https://www.browserstack.com/screenshots/api))

## Usage

to start generating screenshots from urls specified in `conf.urls` using the browser list defined in `conf.browsers`
```
node generate
```


then to serve all generated session and view your screenshot

```
node serve
```

and go to [http://localhost:3000](http://localhost:3000)
