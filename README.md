# CSS-Aware HTML Minifier

Aggressively removes whitespace from HTML; while taking into account each element's CSS properties to ensure the layout of the file is unchanged.

Inline JavaScript and CSS are minified using [UglifyJS](https://github.com/mishoo/UglifyJS) and [clean-css](https://github.com/GoalSmashers/clean-css) respectively.

    $ unreadable --inspect --url http://www.youtube.com --output youtube.min.html
    ✔ 12643 characters removed, 986/986 elements with layout unaffected by minification

## Usage

    -h, --help           output usage information
    -V, --version        output the version number
    -u --url [value]     URL to process
    -i --inspect         Inspect layout before and after, to verify no elements have changed size or position (slower)
    -o --output [value]  File to write minified source to
    -c --config [value]  Path to JSON configuration file (see https://github.com/JamieMason/Unreadable#config)

## Installation

    npm install -g unreadable

You'll need to [Download & Install PhantomJS](http://phantomjs.org/download.html).

## Configuration <a id="config"></a>

You can override any of [Unreadable's defaults](https://github.com/JamieMason/Unreadable/blob/master/defaults.json) by providing a path to a JSON file.

    unreadable --url http://... --config path/to/my/unreadable.json

Only the values you want to override need be defined, so to enable removal of optional closing tags for example - your file would look like this;

    {
      "unreadable": {
        "remove_optional_closing_tags": true
      }
    }

### Defaults

All default values can be found in [defaults.json](https://github.com/JamieMason/Unreadable/blob/master/defaults.json), but here are the key ones;

+ #### remove_optional_closing_tags (false)
Some element's closing tags can be omitted, resulting in a much smaller file. But, doing so can affect layout (http://jsfiddle.net/csswizardry/UMYZs/) so this is disabled by default.

+ #### .optional_closing_tags (String[])
Omitting these element's closing tags is permitted, add/remove any you want to include/exclude as preferred.

+ #### .forbidden_closing_tags (String[])
These elements don't have closing tags, such as `<img src="nevergonna.png"></img>`.

+ #### .uglify_js.* (Object)
These values are applied to UglifyJS and are documented at [https://github.com/mishoo/UglifyJS](https://github.com/mishoo/UglifyJS)

+ #### .uglify_js.inline_script (true)
Since we're Uglifying JavaScript found in `<script>` blocks as opposed to external files, I wouldn't recommend changing this value.

