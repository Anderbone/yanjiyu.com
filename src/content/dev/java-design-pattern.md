---
title: "Common design patterns in Java"
description: "Notes on common Java design patterns including strategy, factory method, and singleton."
date: 2023-11-14
author: "Jiyu"
categories: ["Java"]
tags: ["Java", "Design Patterns"]
draft: false
---

## [Strategy](https://refactoring.guru/design-patterns/strategy/java/example)

The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

**Strategy** is a behavioral design pattern that turns a set of behaviors into objects and makes them interchangeable inside the original context object.

Has-A can be better than Is-A.

Java 8 brought the support of lambda functions, which can serve as simpler alternatives to the Strategy pattern.

Examples in core Java libraries:

- `java.util.Comparator#compare()`, called from `Collections#sort()`
- `javax.servlet.http.HttpServlet#service()` and the `doXXX()` methods that accept `HttpServletRequest` and `HttpServletResponse`
- `javax.servlet.Filter#doFilter()`

Identification: Strategy pattern can be recognized by a method that lets a nested object do the actual work, as well as a setter that allows replacing that object with a different one.

Examples:

## [Factory method](https://refactoring.guru/design-patterns/factory-method/java/example)

Factory Method is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

The pattern is present in core Java libraries:

- `java.util.Calendar#getInstance()`
- `java.util.ResourceBundle#getBundle()`
- `java.text.NumberFormat#getInstance()`
- `java.nio.charset.Charset#forName()`
- `java.net.URLStreamHandlerFactory#createURLStreamHandler(String)`
- `java.util.EnumSet#of()`
- `javax.xml.bind.JAXBContext#createMarshaller()` and similar methods

Identification: Factory methods can be recognized by creation methods that construct objects from concrete classes. While concrete classes are used during the object creation, the return type of the factory methods is usually declared as either an abstract class or an interface.

Examples:

Note: `render()` in `Dialog` could be named `renderDialog()` or `renderWindow()` because it is unrelated to `render()` in the `Button` class.

[A very helpful youtube video](https://www.youtube.com/watch?v=EcFVTgRHJLM)

## [Singleton](https://refactoring.guru/design-patterns/singleton/java/example#lang-features)

Singleton is a creational design pattern, which ensures that only one object of its kind exists and provides a single point of access to it for any other code.

The most common reason for this is to control access to some shared resource—for example, a database or a file.

```java
package refactoring_guru.singleton.example.thread_safe;

public final class Singleton {
    // The field must be declared volatile so that double check lock would work
    // correctly.
    private static volatile Singleton instance;

    public String value;

    private Singleton(String value) {
        this.value = value;
    }

    public static Singleton getInstance(String value) {
        // The approach taken here is called double-checked locking (DCL). It
        // exists to prevent race condition between multiple threads that may
        // attempt to get singleton instance at the same time, creating separate
        // instances as a result.
        //
        // It may seem that having the `result` variable here is completely
        // pointless. There is, however, a very important caveat when
        // implementing double-checked locking in Java, which is solved by
        // introducing this local variable.
        //
        // You can read more info DCL issues in Java here:
        // https://refactoring.guru/java-dcl-issue
        Singleton result = instance;
        if (result != null) {
            return result;
        }
        synchronized(Singleton.class) {
            if (instance == null) {
                instance = new Singleton(value);
            }
            return instance;
        }
    }
}
```
