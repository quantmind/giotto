head-title: $APP_NAME - Options
title: Options
order: 95


Each [paper](/api/paper) is associated with an options object which represent
a set of defaults for [drawings](/api/drawing) and [plugins](/api/plugin).
To access the options for a given paper one uses the
[paper.options](/api/paper#paperoptionsvalue) API method.

<h2>Contents</h2>

[TOC]

## All Options

The default JSON object for all [papers] is displayed below

<div giotto-options></div>

## Margin

A Margin object is associated with a [paper], therefore all drawings within a paper
have the same margin. The default value of margin is

<div giotto-options="margin"></div>

Importantly, ```margin``` can also be specified as percentage, useful when they
are large, of the same order of magnitude as the paper size, and a better responsive
behaviour is required. For example:
```json
{
    "top": 20,
    "right": "20%",
    "bottom": 30,
    "left": "30%"
}
```
is a valid option which will leave a drawing area of ``50%`` the width of the
[paper.domWidth](/api/paper#paperdomwidth).

[papers]: /api/paper "paper API"
[paper]: /api/paper "paper API"
