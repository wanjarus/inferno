"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var t7 = require("../t7");

var supportsTextContent = ("textContent" in document);

var isBrowser = false;

if (typeof window != "undefined") {
  isBrowser = true;
}

var events = {
  "onClick": "click"
};

var events = {
  "onClick": "click"
};

var userAgent = navigator.userAgent,
    isWebKit = userAgent.indexOf("WebKit") !== -1,
    isFirefox = userAgent.indexOf("Firefox") !== -1,
    isTrident = userAgent.indexOf("Trident") !== -1;

var version = "0.2.2";

var recycledFragments = {};
var rootlisteners = null;
var initialisedListeners = false;

if (typeof window != "undefined") {
  rootlisteners = {
    click: []
  };
}

function addRootDomEventListerners() {
  initialisedListeners = true;
  if (rootlisteners !== null) {
    document.addEventListener("click", function (e) {
      for (var i = 0; i < rootlisteners.click.length; i = i + 1 | 0) {
        if (rootlisteners.click[i].target === e.target) {
          rootlisteners.click[i].callback.call(rootlisteners.click[i].component || null, e);
        }
      }
    });
  }
};

var Inferno = {};

Inferno.Type = {
  TEXT: 0,
  TEXT_DIRECT: 1,
  FRAGMENT: 2,
  LIST: 3,
  FRAGMENT_REPLACE: 4,
  LIST_REPLACE: 5
};

function isString(value) {
  return typeof value === "string";
}

function isNumber(value) {
  return typeof value === "number";
}

function isArray(value) {
  return value instanceof Array;
}

function isFunction(value) {
  return typeof value === "function";
}

var Component = (function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "render",
    value: function render() {}
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {}
  }, {
    key: "setState",
    value: function setState(newStateItems) {
      for (var stateItem in newStateItems) {
        this.state[stateItem] = newStateItems[stateItem];
      }
      this.forceUpdate();
    }
  }, {
    key: "replaceState",
    value: function replaceState(newState) {
      this.state = newSate;
      this.forceUpdate();
    }
  }]);

  return Component;
})();

Inferno.Component = Component;

Inferno.dom = {};

Inferno.dom.createElement = function (tag) {
  if (isBrowser) {
    return document.createElement(tag);
  }
};

Inferno.dom.createText = function (text) {
  if (isBrowser) {
    return document.createTextNode(text);
  }
};

Inferno.dom.createEmpty = function (text) {
  if (isBrowser) {
    return document.createTextNode("");
  }
};

Inferno.dom.addAttributes = function (node, attrs, component) {
  var attrName, attrVal;
  for (attrName in attrs) {
    attrVal = attrs[attrName];

    if (events[attrName] != null) {
      clearEventListeners(node, component, attrName);
      addEventListener(node, component, attrName, attrVal);
      continue;
    }

    switch (attrName) {
      case "class":
      case "className":
        node.className = attrVal;
        break;
      default:
        node[attrName] = attrVal;
    }
  }
};

Inferno.dom.createFragment = function () {
  if (isBrowser) {
    return document.createDocumentFragment();
  }
};

Inferno.unmountComponentAtNode = function (dom) {
  var context = getContext(dom);
  if (context !== null) {
    removeFragment(context, dom, context.fragment);
    recycleFragments(context);
    removeContext(dom);
  }
};

function recycleFragments(context) {
  var i = 0;
  for (var type in context.toRecycle) {
    for (i = 0; i < context.toRecycle[type].length; i++) {
      if (!recycledFragments[type]) {
        recycledFragments[type] = [];
      }
      recycledFragments[type].push(context.toRecycle[type][i]);
    }
  }
}

function getRecycledFragment(templateKey) {
  var fragments = recycledFragments[templateKey];
  if (!fragments || fragments.length === 0) {
    return null;
  }
  return fragments.pop();
}

function attachFragmentList(context, list, parentDom, component) {
  for (var i = 0; i < list.length; i++) {
    attachFragment(context, list[i], parentDom, component);
  }
}

function updateFragmentList(context, oldList, list, parentDom, component, outerNextFragment) {
  var oldListLength = oldList.length;
  var listLength = list.length;

  if (listLength === 0) {
    removeFragments(context, parentDom, oldList, 0, oldListLength);
    return;
  } else if (oldListLength === 0) {
    attachFragmentList(context, list, parentDom, component);
    return;
  }

  var oldEndIndex = oldListLength - 1;
  var endIndex = listLength - 1;
  var oldStartIndex = 0,
      startIndex = 0;
  var successful = true;
  var nextItem;
  var oldItem, item;

  outer: while (successful && oldStartIndex <= oldEndIndex && startIndex <= endIndex) {
    successful = false;
    var oldStartItem, oldEndItem, startItem, endItem, doUpdate;

    oldStartItem = oldList[oldStartIndex];
    startItem = list[startIndex];
    while (oldStartItem.key === startItem.key) {
      updateFragment(context, oldStartItem, startItem, parentDom, component);
      oldStartIndex++;startIndex++;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      }
      oldStartItem = oldList[oldStartIndex];
      startItem = list[startIndex];
      successful = true;
    }
    oldEndItem = oldList[oldEndIndex];
    endItem = list[endIndex];
    while (oldEndItem.key === endItem.key) {
      updateFragment(context, oldEndItem, endItem, parentDom, component);
      oldEndIndex--;endIndex--;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      }
      oldEndItem = oldList[oldEndIndex];
      endItem = list[endIndex];
      successful = true;
    }
    while (oldStartItem.key === endItem.key) {
      nextItem = endIndex + 1 < listLength ? list[endIndex + 1] : outerNextFragment;
      updateFragment(context, oldStartItem, endItem, parentDom, component);
      moveFragment(parentDom, endItem, nextItem);
      oldStartIndex++;endIndex--;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      }
      oldStartItem = oldList[oldStartIndex];
      endItem = list[endIndex];
      successful = true;
    }
    while (oldEndItem.key === startItem.key) {
      nextItem = oldStartIndex < oldListLength ? oldList[oldStartIndex] : outerNextFragment;
      updateFragment(context, oldEndItem, startItem, parentDom, component);
      moveFragment(parentDom, startItem, nextItem);
      oldEndIndex--;startIndex++;
      if (oldStartIndex > oldEndIndex || startIndex > endIndex) {
        break outer;
      }
      oldEndItem = oldList[oldEndIndex];
      startItem = list[startIndex];
      successful = true;
    }
  }
  if (oldStartIndex > oldEndIndex) {
    nextItem = endIndex + 1 < listLength ? list[endIndex + 1] : outerNextFragment;
    for (i = startIndex; i <= endIndex; i++) {
      item = list[i];
      attachFragment(context, item, parentDom, component, nextItem);
    }
  } else if (startIndex > endIndex) {
    removeFragments(context, parentDom, oldList, oldStartIndex, oldEndIndex + 1);
  } else {
    var i,
        oldNextItem = oldEndIndex + 1 >= oldListLength ? null : oldList[oldEndIndex + 1];
    var oldListMap = {};
    for (i = oldEndIndex; i >= oldStartIndex; i--) {
      oldItem = oldList[i];
      oldItem.next = oldNextItem;
      oldListMap[oldItem.key] = oldItem;
      oldNextItem = oldItem;
    }
    nextItem = endIndex + 1 < listLength ? list[endIndex + 1] : outerNextFragment;
    for (i = endIndex; i >= startIndex; i--) {
      item = list[i];
      var key = item.key;
      oldItem = oldListMap[key];
      if (oldItem) {
        oldListMap[key] = null;
        oldNextItem = oldItem.next;
        updateFragment(context, oldItem, item, parentDom, component);
        if (parentDom.nextSibling != (nextItem && nextItem.dom)) {
          moveFragment(parentDom, item, nextItem);
        }
      } else {
        attachFragment(context, item, parentDom, component, nextItem);
      }
      nextItem = item;
    }
    for (i = oldStartIndex; i <= oldEndIndex; i++) {
      oldItem = oldList[i];
      if (oldListMap[oldItem.key] !== null) {
        removeFragment(context, parentDom, oldItem);
      }
    }
  }
}

function updateFragment(context, oldFragment, fragment, parentDom, component) {
  if (oldFragment.template !== fragment.template) {
    attachFragment(context, fragment, parentDom, component, oldFragment, true);
  } else {
    var fragmentComponent = oldFragment.component;

    if (fragmentComponent) {
      fragmentComponent.props = fragment.props;
      fragmentComponent.forceUpdate();
      fragment.component = fragmentComponent;
      return;
    }

    var element,
        template,
        valuesLength = oldFragment.valuesLength;

    fragment.dom = oldFragment.dom;
    fragment.valuesLength = valuesLength;

    for (var i = 0; i < valuesLength; i++) {
      template = oldFragment["$t" + i];
      element = oldFragment["$e" + i];
      fragment["$e" + i] = element;
      fragment["$t" + i] = template;

      if (oldFragment["$v" + i] !== fragment["$v" + i]) {
        switch (template) {
          case Inferno.Type.LIST:
          case Inferno.Type.LIST_REPLACE:
            updateFragmentList(context, oldFragment["$v" + i], fragment["$v" + i], element, component);
            break;
          case Inferno.Type.TEXT:
            element.firstChild.nodeValue = fragment["$v" + i];
            break;
          case Inferno.Type.TEXT_DIRECT:
            element.nodeValue = fragment["$v" + i];
            break;
          case Inferno.Type.FRAGMENT:
          case Inferno.Type.FRAGMENT_REPLACE:
            updateFragment(context, oldFragment["$v" + i], fragment["$v" + i], element, component);
            break;
        }
      }
    }
  }
}

function attachFragment(context, fragment, parentDom, component, nextFragment, replace) {
  var fragmentComponent = fragment.component;

  if (fragmentComponent) {
    if (typeof fragmentComponent === "function") {
      fragmentComponent = fragment.component = new fragmentComponent(fragment.props);
      fragmentComponent.context = null;
      fragmentComponent.forceUpdate = Inferno.render.bind(null, fragmentComponent.render.bind(fragmentComponent), parentDom, fragmentComponent);
      fragmentComponent.forceUpdate();
    }
    return;
  }

  var recycledFragment = null;
  var template = fragment.template;
  var templateKey = template.key;

  if (context.shouldRecycle === true) {
    recycledFragment = getRecycledFragment(templateKey);
  }

  if (recycledFragment !== null) {
    updateFragment(context, recycledFragment, fragment, parentDom, component);
  } else {
    template(fragment, component);
    var valuesLength = fragment.valuesLength;
    for (var i = 0; i < valuesLength; i++) {
      switch (fragment["$t" + i]) {
        case Inferno.Type.LIST:
          attachFragmentList(context, fragment["$v" + i], fragment["$e" + i], component);
          break;
        case Inferno.Type.LIST_REPLACE:
          //debugger;
          break;
        case Inferno.Type.FRAGMENT:
          //debugger;
          break;
        case Inferno.Type.FRAGMENT_REPLACE:
          attachFragment(context, fragment["$v" + i], parentDom, component, fragment["$e" + i], true);
          fragment["$e" + i] = fragment["$v" + i].dom.parentNode;
          break;
      }
    }
  }

  insertFragment(context, parentDom, fragment.dom, nextFragment, replace);
}

var contexts = [];

function removeContext(dom) {
  for (var i = 0; i < contexts.length; i++) {
    if (contexts[i].dom === dom) {
      contexts.splice(i, 1);
      return;
    }
  }
}

function getContext(dom) {
  for (var i = 0; i < contexts.length; i++) {
    if (contexts[i].dom === dom) {
      return contexts[i];
    }
  }
  return null;
}

Inferno.render = function (fragment, dom, component) {
  var context, generatedFragment;
  if (component === undefined) {
    if (initialisedListeners === false) {
      addRootDomEventListerners();
    }
    context = getContext(dom);
    if (context === null) {
      context = {
        toRecycle: {},
        fragment: fragment,
        dom: dom,
        shouldRecycle: true
      };
      attachFragment(context, fragment, dom, component);
      contexts.push(context);
    } else {
      updateFragment(context, context.fragment, fragment, dom, component, false);
      context.fragment = fragment;
    }
  } else {
    if (component.context === null) {
      generatedFragment = fragment();
      context = component.context = {
        toRecycle: {},
        fragment: generatedFragment,
        dom: dom,
        shouldRecycle: true
      };
      attachFragment(context, generatedFragment, dom, component);
    } else {
      generatedFragment = fragment();
      context = component.context;
      updateFragment(context, context.fragment, generatedFragment, dom, component, false);
      context.fragment = generatedFragment;
    }
  }
};

function moveFragment(parentDom, item, nextItem) {
  var domItem = item.dom,
      domRefItem = nextItem && nextItem.dom;

  if (domItem !== domRefItem) {
    if (domRefItem) {
      parentDom.insertBefore(domItem, domRefItem);
    } else {
      parentDom.appendChild(domItem);
    }
  }
}

function isInputProperty(tag, attrName) {
  switch (tag) {
    case "input":
      return attrName === "value" || attrName === "checked";
    case "textarea":
      return attrName === "value";
    case "select":
      return attrName === "value" || attrName === "selectedIndex";
    case "option":
      return attrName === "selected";
  }
};

function addEventListener(parentDom, component, listenerName, callback) {
  rootlisteners[events[listenerName]].push({
    target: parentDom,
    callback: callback,
    component: component
  });
}

function clearEventListeners(parentDom, component, listenerName) {
  var listeners = rootlisteners[events[listenerName]];
  var index = 0;
  while (index < listeners.length) {
    if (listeners[index].target === parentDom) {
      listeners.splice(index, 1);
      index = 0;
    }
    index++;
  }
}

function updateAttributes(parentDom, tag, component, attrs, oldAttrs) {
  var changes, attrName;
  if (attrs) {
    for (attrName in attrs) {
      var attrValue = attrs[attrName];
      if (oldAttrs && oldAttrs[attrName] === attrs[attrName]) {
        continue;
      }
      if (events[attrName] != null) {
        clearEventListeners(parentDom, component, attrName);
        addEventListener(parentDom, component, attrName, attrValue);
        continue;
      }
      if (attrName === "style") {
        var oldAttrValue = oldAttrs && oldAttrs[attrName];
        if (oldAttrValue !== attrValue) {
          updateStyle(domElement, oldAttrValue, attrs, attrValue);
        }
      } else if (isInputProperty(tag, attrName)) {
        if (parentDom[attrName] !== attrValue) {
          parentDom[attrName] = attrValue;
        }
      } else if (!oldAttrs || oldAttrs[attrName] !== attrValue) {
        if (attrName === "class") {
          parentDom.className = attrValue;
        } else {
          updateAttribute(parentDom, attrName, attrValue);
        }
      }
    }
  }
  if (oldAttrs) {
    for (attrName in oldAttrs) {
      if (!attrs || attrs[attrName] === undefined) {
        if (attrName === "class") {
          parentDom.className = "";
        } else if (!isInputProperty(tag, attrName)) {
          parentDom.removeAttribute(attrName);
        }
      }
    }
  }
  return changes;
}

function insertFragment(context, parentDom, domNode, nextFragment, replace) {
  var noDestroy = false;
  if (nextFragment) {
    var domNextFragment = nextFragment.dom;
    if (!domNextFragment) {
      domNextFragment = nextFragment;
      parentDom = domNextFragment.parentNode;
      noDestroy = true;
    }
    if (replace) {
      if (noDestroy === false) {
        destroyFragment(context, nextFragment);
      }
      parentDom.replaceChild(domNode, domNextFragment);
    } else {
      parentDom.insertBefore(domNode, domNextFragment);
    }
  } else {
    parentDom.appendChild(domNode);
  }
}

function removeFragments(context, parentDom, fragments, i, to) {
  for (; i < to; i++) {
    removeFragment(context, parentDom, fragments[i]);
  }
}

function removeFragment(context, parentDom, item) {
  var domItem = item.dom;
  destroyFragment(context, item);
  parentDom.removeChild(domItem);
}

function destroyFragment(context, fragment) {
  var templateKey = fragment.template.key;
  if (context.shouldRecycle === true) {
    var toRecycleForKey = context.toRecycle[templateKey];
    if (!toRecycleForKey) {
      context.toRecycle[templateKey] = toRecycleForKey = [];
    }
    toRecycleForKey.push(fragment);
  }
}

function updateAttribute(parentDom, name, value) {
  if (value === false || value == null) {
    parentDom.removeAttribute(name);
  } else {
    if (value === true) {
      value = "";
    }
    var colonIndex = name.indexOf(":"),
        ns;
    if (colonIndex !== -1) {
      var prefix = name.substr(0, colonIndex);
      switch (prefix) {
        case "xlink":
          ns = "http://www.w3.org/1999/xlink";
          break;
      }
    }
    parentDom.setAttribute(name, value);
  }
};

function setTextContent(parentDom, text, update) {
  if (text) {
    if (supportsTextContent) {
      parentDom.textContent = text;
    } else {
      parentDom.innerText = text;
    }
  } else {
    if (update) {
      while (domElement.firstChild) {
        parentDom.removeChild(parentDom.firstChild);
      }
    }
    parentDom.appendChild(emptyTextNode());
  }
};

module.exports = Inferno;
//# sourceMappingURL=inferno.js.map
