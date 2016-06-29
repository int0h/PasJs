# PasJs
PasJs is short for Pascal - JavaScript;
It's a framework (or runtime) created to provide a way to develop desktop applications using both **JavaScript** and **Native desktop UI**.
It's a very very alpha, more a proof of concept. I'm going to change the version of SpiderMonkey and rewrite whole Delphi part (it's based on Delphi-javascript project, I'm going to leave it) which is exremely small because of high level of SMAPI provided by Delphi-javascript.

Nevertheless I was able to create 2 projects using it:
- formDesigner - is quite glitchy program made to help design a forms and save it to JSON. Part of the functionality is accessible only via console (bottom frame). But I managed to make a form for the second project.
- papers-game - is a game which was my university project (we were free to choose any language and I wanted to challenge my project). It's much more stable than previous demo-project. All logic and UI elements are written in JS and you can change them (up to writting absolutely new app) without recompilling runtime (app.exe);

