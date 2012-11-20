## CSS-Aware HTML Minifier

Aggressively removes whitespace from HTML; while taking into account each element's CSS properties to ensure the layout of the file is unchanged.

Inline JavaScript and CSS are minified using [UglifyJS](https://github.com/mishoo/UglifyJS) and [clean-css](https://github.com/GoalSmashers/clean-css) respectively.

## In Beta

Asterisk is a young project so there are still some TODOs. All comments are stripped for example, including IE Conditional Comments (this should be implemented over the next few days).

## Example Usage

    asterisk --inspect --url http://www.nytimes.com --output nytimes.min.html

> **Output:** `1558/1558 elements with layout unaffected after minification`*

## Installation

    npm install -g asterisk

## PhantomJS

You'll need to [Download & Install PhantomJS](http://phantomjs.org/download.html).

## Configuration <a id="config"></a>

To override any of Asterisk's defaults, you can point to a JSON file.

    asterisk --url http://... --config path/to/my/overrides.json

### Default Values

All default values can be seen in [defaults.json](https://github.com/JamieMason/Asterisk/blob/master/defaults.json) but here are the key ones;

#### remove_optional_closing_tags (false)
Some element's closing tags can be omitted, resulting in a much smaller file. But, doing so can affect layout (http://jsfiddle.net/csswizardry/UMYZs/) so this disabled by default.

#### .optional_closing_tags (String[])
Omitting these element's closing tags is permitted, add/remove any you want to include/exclude as preferred.

#### .forbidden_closing_tags (String[])
These elements don't have closing tags, such as `<img src="nevergonna.png"></img>`.

#### .uglify_js.* (Object)
These values are applied to UglifyJS and are documented at [https://github.com/mishoo/UglifyJS](https://github.com/mishoo/UglifyJS)

#### .uglify_js.inline_script (true)
Since we're Uglifying JavaScript found in `<script>` blocks as opposed to external files, I wouldn't recommend changing this value.

### Your overrides JSON file

Only the values you want to override need be defined, so to enable removal of optional closing tags for example - your file would look like this;

    {
      "asterisk_minify": {
        "remove_optional_closing_tags": true
      }
    }

\* as well as can be determined while Asterisk is still in beta - please [report any issues](https://github.com/JamieMason/Asterisk/issues/new).
