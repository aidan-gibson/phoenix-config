https://kasper.github.io/phoenix/ documentation
https://github.com/mafredri/phoenix-config/tree/main integrate sept 18 updates!

meta+shift left/right is fucked
# meta setup
it's nodejs proj, uses webpack
run "build" (specified in package.json). this outputs .phoenix.js and phoenix.debug.js in out. put .phoenix.js in home folder. phoenix app (daemon) should catch the change and say (phoenix reloaded) in a modal.

`npm update` will update deps and typings

changed `build` command to also copy the file to home folder

==make sure new keybinds dont interfere w `karabiner`==
# TODO

* make a Center & Resize (1/3rd width?) keybind which only applies for big screen.
* memorize all keybinds
* make sure if statements are turned into 'if/else if' where appropriate.
* go balls to the walls optimizing , making functions, etc. gonna be extending on this for years and small efficiency gains will be noticed day-to-day.
* find duplicated code fragments with jetbrains
* spaces presets
* look at the example configs to make sure there isn't a better way / look for inspo (fully scope )
* put this entire repo into dotfiles(?) once i have that sorted out
## spaces
fat presets. i hit one button and it knows what to do with all the windows. 

if big screen:
Whatever is focused is center 1/2. other windows occupy the two edges


depends on which apps are in play (vscode can always make small) and screens available and their respective sizes
# example configs
https://github.com/kasper/phoenix/wiki
[documentation](https://kasper.github.io/phoenix/)
# shit it can now do
input modal
move windows to spaces
device sleep/wake https://kasper.github.io/phoenix/api/events/#device
# hardlink
`ln phoenix.js ~/.phoenix.js` from out folder
symlink wasn't working, the phoenix app kept overwriting it. dw tho, hardlink should be just fine (?)
hardlink don't work either cuz the build replaces the .js files when it runs, breaking the link. gotta change the webpack output dir (which proved to be super annoying/difficult/impossible) or i can use hazel to automatically copy the file on builds

# adsf
Forked from [this](https://github.com/mafredri/phoenix-config/tree/main)
[typings](https://github.com/mafredri/phoenix-typings)


## Key bindings

The definition of `hyper` and `hyperShift` can be found in [src/config.ts](src/config.ts).

### Basic bindings

* `hyper + Left` (Left half of screen)
* `hyper + Right` (Right half of screen)
* `hyper + Up` (Top half of screen height, keeps current width)
* `hyper + Down` (Bottom half of screen height, keeps current width)
* `hyper + Return` (Toggle maximize, remembers unmaximized position)
* `hyper + Tab` (Jump to next screen whilst keeping relative size and placement)
* `hyper + m` (Minimize focused window. holding it keeps going)

Getting it around
* `hyperShift + Left` (Move window to left edge of screen)
* `hyperShift + Right` (Move window to right edge of screen)
* `hyperShift + Up` (Move window to top edge of screen)
* `hyperShift + Down` (Move window to bottom edge of screen)

* `hyperShift + Return` (Move window to center of screen)
* `hyperShift + Tab` (Jump focused window to next screen whilst maintaining current window size)
* `hyperShift + h` maximize height

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
