Asterisk
------

## Usage

#### CSS-aware HTML Minifier

Opens your web page in PhantomJS, compressing the HTML while taking into account each Element's CSS styles.

    asterisk --url http://www.nytimes.com/pages/technology/index.html --task minify > ./index.min.html

## Installation

    npm install -g asterisk

## PhantomJS

You'll need PhantomJS, available at [http://phantomjs.org/download.html](http://phantomjs.org/download.html).

## Configuration <a id="config"></a>

To override any of Asterisk's defaults, you can point to a JSON file.

    asterisk --url http://... --task minify --config path/to/my/overrides.json

### Default Values

All default values can be seen in [defaults.json](https://github.com/JamieMason/Asterisk/blob/master/defaults.json) but here are the key ones;

#### remove_optional_closing_tags (false)
Some element's closing tags can be omitted, resulting in a much smaller file. But, doing so can affect layout (http://jsfiddle.net/csswizardry/UMYZs/) so this disabled by default.

#### .optional_closing_tags (String[])
Omitting these element's closing tags is permitted, add/remove any you want to include/exclude as preferred.

#### .forbidden_closing_tags (String[])
These elements don't have closing tags, such as `<img src="nevergonna.png"></img>`.

#### .uglify_js.* (Object)
These values are applied to UglifyJS and are documented at https://github.com/mishoo/UglifyJS

#### .uglify_js.inline_script (true)
Since we're Uglifying JavaScript found in <script> blocks as opposed to external files, I wouldn't recommend changing this value.
