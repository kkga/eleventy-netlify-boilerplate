---
title: Using custom resources as data containers in Godot
tags:
  - draft
  - godot
  - gamedev
---

```python/0/2
export var name: String = "Class Name"
export(String, MULTILINE) var description: String = "Class Description"
export(String, MULTILINE) var description: String = "Class Description"
export(String, MULTILINE) var description: String = "Class Description"
export(String, MULTILINE) var description: String = "Class Description"
export(String, MULTILINE) var description: String = "Class Description"
export(String, MULTILINE) var description: String = "Class Description"

func _calcSmth(input: int) -> int:
    return input * 2
```
