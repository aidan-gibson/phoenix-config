# add mouse control
dragging to corners, top, etc

# Chrome Finder Box Issues

Hyper+right on finder box alone moves the finder box
finder box hangs the entire thing when Cmd+Esc


window.title on search element alone is 
"Find in page\n T-watcher Dashboard"

window.title on window with search elem is
"T-watcher Dashboard - Google Chrome"






























# hardlink
`ln phoenix.js ~/.phoenix.js` from out folder
symlink wasn't working, the phoenix app kept overwriting it. dw tho, hardlink should be just fine (?)
hardlink don't work either cuz the build replaces the .js files when it runs, breaking the link. gotta change the webpack output dir (which proved to be super annoying/difficult/impossible) or i can use hazel to automatically copy the file on builds

# adsf
Forked from [this](https://github.com/mafredri/phoenix-config/tree/main)
[typings](https://github.com/mafredri/phoenix-typings)


karabiner shit seems done; just phoenix now
## Key bindings

The definition of `hyper` and `hyperShift` can be found in [src/config.ts](src/config.ts).

### Basic bindings

* `hyper + Left` (Left half of screen)
* `hyper + Right` (Right half of screen)
* `hyper + Up` (Top half of screen height, keeps current width)
* `hyper + Down` (Bottom half of screen height, keeps current width)
* `hyper + Return` (Toggle maximize, remembers unmaximized position)
* `hyper + Tab` (Jump to next screen whilst keeping relative size and placement)
* `hyper + Delete` (Minimize focused window)
* `hyperShift + Left` (Move window to left edge of screen)
* `hyperShift + Right` (Move window to right edge of screen)
* `hyperShift + Up` (Move window to top edge of screen)
* `hyperShift + Down` (Move window to bottom edge of screen)
* `hyperShift + Return` (Move window to center of screen)
* `hyperShift + Tab` (Jump focused window to next screen whilst maintaining current window size)

Use combos of the key bindings to further place the windows:

* `hyper + Left` + `hyper + Down` (Bottom left corner of screen)
* `hyper + Enter` + `hyper + Up` (Top half of screen, full width)



### Misc bindings


* `hyper + Space` (Experimental: search for windows, tab to cycle, enter to switch, esc to cancel)
* `Cmd + Escape` (Cycle between windows of current application, (not) including minimized (togglable tho in cycle.ts line 43) and windows on a different screen)
* `Cmd + Shift + Escape` (Same as `Cmd + Escape` except in reverse order)
* `Cmd + h` (Hides the focused app or all visible apps if held down)

## Misc features

* Switch between Karabiner-Elements profiles when screens change
* Refresh screen brightness info when screens change (using `ddcctl`)
* Support disabling / re-enabling all current keybindings via [src/key.ts](src/key.ts) (used by scanner)

## Building

```
git clone https://github.com/mafredri/phoenix-config.git
cd phoenix-config
yarn install
yarn run build
```

The TypeScript compiler and Webpack will produce `out/phoenix.js` that can be used as Phoenix configuration. 

For development, `yarn start` will run Webpack in watch-mode.

## Debugging

In a terminal, run:

```console
$ log stream --process Phoenix
```

Anything logged via logger (`import log from './logger';`) will show up as human friendly output in the terminal. `Phoenix.log` can also be used, but it only supports strings, much of the heavy lifting is already done by logger to create a similar experience to `console.log` in the browser.

You can also read about [Attaching to Web Inspector for Debugging](https://github.com/kasper/phoenix/wiki/Attaching-to-Web-Inspector-for-Debugging) in the Phoenix wiki. This gives access to true `console.log` and ability to use `debugger` statements in your code.
