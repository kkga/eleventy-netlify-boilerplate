---
title: Using custom resources as data containers in Godot
tags:
  - draft
  - godot
  - gamedev
---

The concept of separating data and logic in [Godot](https://godotengine.org/) is quite powerful: you're using Resources to store some data about a class and custom scripts to define logic. Of course, it's not as simple as that and scripts are technically resources too, but that's not the point.

In this post you'll learn how to create your own custom resources to hold data of various types that can be accessed and modified through the inspector panel and scripts. We'll start with the most basic example and then dig into how you can take it one step further by creating a fully dynamic inspector interface that changes depending on which variables are set in the resource.

![structure](/static/img/PNG imagen.png)

---

As a basic example, we're going to create a character class resource that defines a variety of stats for different playable classes (such as Warrior, Wizard, etc).

Start by creating a script called `CharacterClass.gd`:

```
extends Resource
class_name CharacterClass

export var name: = "Character name"
export var description: = "Character description"
```
