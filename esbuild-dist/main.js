import {
  allCalculators,
  calculatorCategories,
  getCalculatorStats,
  getRelatedCalculators,
  searchCalculators
} from "./chunk-PZGFNW2T.js";
import {
  HelmetProvider,
  JsonLd,
  SeoHead
} from "./chunk-YXSNPAEA.js";
import {
  createPageUrl as createPageUrl2
} from "./chunk-ROKYT3OR.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./chunk-TIYYSSOB.js";
import "./chunk-QRWSZGZM.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CollapsibleContent,
  CollapsibleTrigger,
  Root
} from "./chunk-KMQ37Z57.js";
import {
  Presence
} from "./chunk-6QDB6RBQ.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "./chunk-32ETQDIX.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Combination_default,
  FocusScope,
  hideOthers,
  useFocusGuards
} from "./chunk-2DGHTBXQ.js";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "./chunk-ZLF73IFG.js";
import {
  FAQSection,
  SeoProvider,
  useSeo
} from "./chunk-KZKM7WHP.js";
import {
  usePrevious
} from "./chunk-ICMCGXKF.js";
import {
  DismissableLayer,
  Portal,
  Root as Root2
} from "./chunk-G2D7ODQY.js";
import {
  useCallbackRef,
  useId
} from "./chunk-UYVYEFZE.js";
import {
  createCollection,
  useDirection
} from "./chunk-66ZJ7JT3.js";
import {
  composeEventHandlers,
  createContext2,
  createContextScope,
  useControllableState,
  useLayoutEffect2
} from "./chunk-RDJYUOP4.js";
import {
  Label
} from "./chunk-AXLI4SNI.js";
import {
  Input
} from "./chunk-KK4JIGNC.js";
import {
  Button
} from "./chunk-RTS3GJRL.js";
import {
  Primitive,
  dispatchDiscreteCustomEvent,
  require_react_dom
} from "./chunk-VKAPTTXR.js";
import {
  composeRefs,
  createSlot,
  cva,
  useComposedRefs
} from "./chunk-DOIEHZ4R.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Book,
  Brain,
  Briefcase,
  Building,
  Bus,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Clock,
  Cookie,
  ExternalLink,
  FileText,
  GraduationCap,
  HandCoins,
  Heart,
  House,
  Landmark,
  LoaderCircle,
  MapPin,
  Menu,
  Percent,
  PiggyBank,
  PoundSterling,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  User,
  Users,
  Utensils,
  X,
  Zap
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __commonJS,
  __toESM,
  cn,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// src/main.jsx
var import_react31 = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);

// src/pages/index.jsx
var import_react29 = __toESM(require_react(), 1);

// src/pages/Layout.jsx
var import_react5 = __toESM(require_react(), 1);

// src/components/ui/sheet.jsx
var React2 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-dialog/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, { scope: __scopeDialog, forceMount, children: React.Children.map(children, (child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = React.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combination_default, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent = React.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME;
var DialogContentModal = React.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = React.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = React.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = React.useRef(false);
    const hasPointerDownOutsideRef = React.useRef(false);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = React.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  React.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  React.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root3 = Dialog;
var Trigger = DialogTrigger;
var Portal2 = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;

// src/components/ui/sheet.jsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var Sheet = Root3;
var SheetTrigger = Trigger;
var SheetClose = Close;
var SheetPortal = Portal2;
var SheetOverlay = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
var sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
var SheetContent = React2.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(SheetPortal, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SheetOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
var SheetDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;

// src/components/ui/separator.jsx
var React4 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-separator/dist/index.mjs
var React3 = __toESM(require_react(), 1);
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator = React3.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root4 = Separator;

// src/components/ui/separator.jsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var Separator2 = React4.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Root4,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator2.displayName = Root4.displayName;

// src/components/ui/collapsible.jsx
var Collapsible = Root;
var CollapsibleTrigger2 = CollapsibleTrigger;
var CollapsibleContent2 = CollapsibleContent;

// src/components/ui/navigation-menu.jsx
var React6 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-navigation-menu/dist/index.mjs
var React5 = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var NAVIGATION_MENU_NAME = "NavigationMenu";
var [Collection, useCollection, createCollectionScope] = createCollection(NAVIGATION_MENU_NAME);
var [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] = createCollection(NAVIGATION_MENU_NAME);
var [createNavigationMenuContext, createNavigationMenuScope] = createContextScope(
  NAVIGATION_MENU_NAME,
  [createCollectionScope, createFocusGroupCollectionScope]
);
var [NavigationMenuProviderImpl, useNavigationMenuContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var NavigationMenu = React5.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = "horizontal",
      dir,
      ...NavigationMenuProps
    } = props;
    const [navigationMenu, setNavigationMenu] = React5.useState(null);
    const composedRef = useComposedRefs(forwardedRef, (node) => setNavigationMenu(node));
    const direction = useDirection(dir);
    const openTimerRef = React5.useRef(0);
    const closeTimerRef = React5.useRef(0);
    const skipDelayTimerRef = React5.useRef(0);
    const [isOpenDelayed, setIsOpenDelayed] = React5.useState(true);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: (value2) => {
        const isOpen = value2 !== "";
        const hasSkipDelayDuration = skipDelayDuration > 0;
        if (isOpen) {
          window.clearTimeout(skipDelayTimerRef.current);
          if (hasSkipDelayDuration) setIsOpenDelayed(false);
        } else {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => setIsOpenDelayed(true),
            skipDelayDuration
          );
        }
        onValueChange?.(value2);
      },
      defaultProp: defaultValue ?? "",
      caller: NAVIGATION_MENU_NAME
    });
    const startCloseTimer = React5.useCallback(() => {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => setValue(""), 150);
    }, [setValue]);
    const handleOpen = React5.useCallback(
      (itemValue) => {
        window.clearTimeout(closeTimerRef.current);
        setValue(itemValue);
      },
      [setValue]
    );
    const handleDelayedOpen = React5.useCallback(
      (itemValue) => {
        const isOpenItem = value === itemValue;
        if (isOpenItem) {
          window.clearTimeout(closeTimerRef.current);
        } else {
          openTimerRef.current = window.setTimeout(() => {
            window.clearTimeout(closeTimerRef.current);
            setValue(itemValue);
          }, delayDuration);
        }
      },
      [value, setValue, delayDuration]
    );
    React5.useEffect(() => {
      return () => {
        window.clearTimeout(openTimerRef.current);
        window.clearTimeout(closeTimerRef.current);
        window.clearTimeout(skipDelayTimerRef.current);
      };
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: true,
        value,
        dir: direction,
        orientation,
        rootNavigationMenu: navigationMenu,
        onTriggerEnter: (itemValue) => {
          window.clearTimeout(openTimerRef.current);
          if (isOpenDelayed) handleDelayedOpen(itemValue);
          else handleOpen(itemValue);
        },
        onTriggerLeave: () => {
          window.clearTimeout(openTimerRef.current);
          startCloseTimer();
        },
        onContentEnter: () => window.clearTimeout(closeTimerRef.current),
        onContentLeave: startCloseTimer,
        onItemSelect: (itemValue) => {
          setValue((prevValue) => prevValue === itemValue ? "" : itemValue);
        },
        onItemDismiss: () => setValue(""),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          Primitive.nav,
          {
            "aria-label": "Main",
            "data-orientation": orientation,
            dir: direction,
            ...NavigationMenuProps,
            ref: composedRef
          }
        )
      }
    );
  }
);
NavigationMenu.displayName = NAVIGATION_MENU_NAME;
var SUB_NAME = "NavigationMenuSub";
var NavigationMenuSub = React5.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      ...subProps
    } = props;
    const context = useNavigationMenuContext(SUB_NAME, __scopeNavigationMenu);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: SUB_NAME
    });
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: false,
        value,
        dir: context.dir,
        orientation,
        rootNavigationMenu: context.rootNavigationMenu,
        onTriggerEnter: (itemValue) => setValue(itemValue),
        onItemSelect: (itemValue) => setValue(itemValue),
        onItemDismiss: () => setValue(""),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Primitive.div, { "data-orientation": orientation, ...subProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuSub.displayName = SUB_NAME;
var NavigationMenuProvider = (props) => {
  const {
    scope,
    isRootMenu,
    rootNavigationMenu,
    dir,
    orientation,
    children,
    value,
    onItemSelect,
    onItemDismiss,
    onTriggerEnter,
    onTriggerLeave,
    onContentEnter,
    onContentLeave
  } = props;
  const [viewport, setViewport] = React5.useState(null);
  const [viewportContent, setViewportContent] = React5.useState(/* @__PURE__ */ new Map());
  const [indicatorTrack, setIndicatorTrack] = React5.useState(null);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    NavigationMenuProviderImpl,
    {
      scope,
      isRootMenu,
      rootNavigationMenu,
      value,
      previousValue: usePrevious(value),
      baseId: useId(),
      dir,
      orientation,
      viewport,
      onViewportChange: setViewport,
      indicatorTrack,
      onIndicatorTrackChange: setIndicatorTrack,
      onTriggerEnter: useCallbackRef(onTriggerEnter),
      onTriggerLeave: useCallbackRef(onTriggerLeave),
      onContentEnter: useCallbackRef(onContentEnter),
      onContentLeave: useCallbackRef(onContentLeave),
      onItemSelect: useCallbackRef(onItemSelect),
      onItemDismiss: useCallbackRef(onItemDismiss),
      onViewportContentChange: React5.useCallback((contentValue, contentData) => {
        setViewportContent((prevContent) => {
          prevContent.set(contentValue, contentData);
          return new Map(prevContent);
        });
      }, []),
      onViewportContentRemove: React5.useCallback((contentValue) => {
        setViewportContent((prevContent) => {
          if (!prevContent.has(contentValue)) return prevContent;
          prevContent.delete(contentValue);
          return new Map(prevContent);
        });
      }, []),
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Collection.Provider, { scope, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ViewportContentProvider, { scope, items: viewportContent, children }) })
    }
  );
};
var LIST_NAME = "NavigationMenuList";
var NavigationMenuList = React5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...listProps } = props;
    const context = useNavigationMenuContext(LIST_NAME, __scopeNavigationMenu);
    const list = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Primitive.ul, { "data-orientation": context.orientation, ...listProps, ref: forwardedRef });
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Primitive.div, { style: { position: "relative" }, ref: context.onIndicatorTrackChange, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Collection.Slot, { scope: __scopeNavigationMenu, children: context.isRootMenu ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroup, { asChild: true, children: list }) : list }) });
  }
);
NavigationMenuList.displayName = LIST_NAME;
var ITEM_NAME = "NavigationMenuItem";
var [NavigationMenuItemContextProvider, useNavigationMenuItemContext] = createNavigationMenuContext(ITEM_NAME);
var NavigationMenuItem = React5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, value: valueProp, ...itemProps } = props;
    const autoValue = useId();
    const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
    const contentRef = React5.useRef(null);
    const triggerRef = React5.useRef(null);
    const focusProxyRef = React5.useRef(null);
    const restoreContentTabOrderRef = React5.useRef(() => {
    });
    const wasEscapeCloseRef = React5.useRef(false);
    const handleContentEntry = React5.useCallback((side = "start") => {
      if (contentRef.current) {
        restoreContentTabOrderRef.current();
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
      }
    }, []);
    const handleContentExit = React5.useCallback(() => {
      if (contentRef.current) {
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) restoreContentTabOrderRef.current = removeFromTabOrder(candidates);
      }
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      NavigationMenuItemContextProvider,
      {
        scope: __scopeNavigationMenu,
        value,
        triggerRef,
        contentRef,
        focusProxyRef,
        wasEscapeCloseRef,
        onEntryKeyDown: handleContentEntry,
        onFocusProxyEnter: handleContentEntry,
        onRootContentClose: handleContentExit,
        onContentFocusOutside: handleContentExit,
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Primitive.li, { ...itemProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuItem.displayName = ITEM_NAME;
var TRIGGER_NAME2 = "NavigationMenuTrigger";
var NavigationMenuTrigger = React5.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, disabled, ...triggerProps } = props;
  const context = useNavigationMenuContext(TRIGGER_NAME2, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(TRIGGER_NAME2, props.__scopeNavigationMenu);
  const ref = React5.useRef(null);
  const composedRefs = useComposedRefs(ref, itemContext.triggerRef, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, itemContext.value);
  const contentId = makeContentId(context.baseId, itemContext.value);
  const hasPointerMoveOpenedRef = React5.useRef(false);
  const wasClickCloseRef = React5.useRef(false);
  const open = itemContext.value === context.value;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Collection.ItemSlot, { scope: __scopeNavigationMenu, value: itemContext.value, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroupItem, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Primitive.button,
      {
        id: triggerId,
        disabled,
        "data-disabled": disabled ? "" : void 0,
        "data-state": getOpenState(open),
        "aria-expanded": open,
        "aria-controls": contentId,
        ...triggerProps,
        ref: composedRefs,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, () => {
          wasClickCloseRef.current = false;
          itemContext.wasEscapeCloseRef.current = false;
        }),
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse(() => {
            if (disabled || wasClickCloseRef.current || itemContext.wasEscapeCloseRef.current || hasPointerMoveOpenedRef.current)
              return;
            context.onTriggerEnter(itemContext.value);
            hasPointerMoveOpenedRef.current = true;
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse(() => {
            if (disabled) return;
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          })
        ),
        onClick: composeEventHandlers(props.onClick, () => {
          context.onItemSelect(itemContext.value);
          wasClickCloseRef.current = open;
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const verticalEntryKey = context.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
          const entryKey = { horizontal: "ArrowDown", vertical: verticalEntryKey }[context.orientation];
          if (open && event.key === entryKey) {
            itemContext.onEntryKeyDown();
            event.preventDefault();
          }
        })
      }
    ) }) }),
    open && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        Root2,
        {
          "aria-hidden": true,
          tabIndex: 0,
          ref: itemContext.focusProxyRef,
          onFocus: (event) => {
            const content = itemContext.contentRef.current;
            const prevFocusedElement = event.relatedTarget;
            const wasTriggerFocused = prevFocusedElement === ref.current;
            const wasFocusFromContent = content?.contains(prevFocusedElement);
            if (wasTriggerFocused || !wasFocusFromContent) {
              itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
            }
          }
        }
      ),
      context.viewport && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { "aria-owns": contentId })
    ] })
  ] });
});
NavigationMenuTrigger.displayName = TRIGGER_NAME2;
var LINK_NAME = "NavigationMenuLink";
var LINK_SELECT = "navigationMenu.linkSelect";
var NavigationMenuLink = React5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroupItem, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Primitive.a,
      {
        "data-active": active ? "" : void 0,
        "aria-current": active ? "page" : void 0,
        ...linkProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(
          props.onClick,
          (event) => {
            const target = event.target;
            const linkSelectEvent = new CustomEvent(LINK_SELECT, {
              bubbles: true,
              cancelable: true
            });
            target.addEventListener(LINK_SELECT, (event2) => onSelect?.(event2), { once: true });
            dispatchDiscreteCustomEvent(target, linkSelectEvent);
            if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
              const rootContentDismissEvent = new CustomEvent(ROOT_CONTENT_DISMISS, {
                bubbles: true,
                cancelable: true
              });
              dispatchDiscreteCustomEvent(target, rootContentDismissEvent);
            }
          },
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
NavigationMenuLink.displayName = LINK_NAME;
var INDICATOR_NAME = "NavigationMenuIndicator";
var NavigationMenuIndicator = React5.forwardRef((props, forwardedRef) => {
  const { forceMount, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, props.__scopeNavigationMenu);
  const isVisible = Boolean(context.value);
  return context.indicatorTrack ? import_react_dom.default.createPortal(
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Presence, { present: forceMount || isVisible, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NavigationMenuIndicatorImpl, { ...indicatorProps, ref: forwardedRef }) }),
    context.indicatorTrack
  ) : null;
});
NavigationMenuIndicator.displayName = INDICATOR_NAME;
var NavigationMenuIndicatorImpl = React5.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, __scopeNavigationMenu);
  const getItems = useCollection(__scopeNavigationMenu);
  const [activeTrigger, setActiveTrigger] = React5.useState(
    null
  );
  const [position, setPosition] = React5.useState(null);
  const isHorizontal = context.orientation === "horizontal";
  const isVisible = Boolean(context.value);
  React5.useEffect(() => {
    const items = getItems();
    const triggerNode = items.find((item) => item.value === context.value)?.ref.current;
    if (triggerNode) setActiveTrigger(triggerNode);
  }, [getItems, context.value]);
  const handlePositionChange = () => {
    if (activeTrigger) {
      setPosition({
        size: isHorizontal ? activeTrigger.offsetWidth : activeTrigger.offsetHeight,
        offset: isHorizontal ? activeTrigger.offsetLeft : activeTrigger.offsetTop
      });
    }
  };
  useResizeObserver(activeTrigger, handlePositionChange);
  useResizeObserver(context.indicatorTrack, handlePositionChange);
  return position ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    Primitive.div,
    {
      "aria-hidden": true,
      "data-state": isVisible ? "visible" : "hidden",
      "data-orientation": context.orientation,
      ...indicatorProps,
      ref: forwardedRef,
      style: {
        position: "absolute",
        ...isHorizontal ? {
          left: 0,
          width: position.size + "px",
          transform: `translateX(${position.offset}px)`
        } : {
          top: 0,
          height: position.size + "px",
          transform: `translateY(${position.offset}px)`
        },
        ...indicatorProps.style
      }
    }
  ) : null;
});
var CONTENT_NAME2 = "NavigationMenuContent";
var NavigationMenuContent = React5.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useNavigationMenuContext(CONTENT_NAME2, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(CONTENT_NAME2, props.__scopeNavigationMenu);
  const composedRefs = useComposedRefs(itemContext.contentRef, forwardedRef);
  const open = itemContext.value === context.value;
  const commonProps = {
    value: itemContext.value,
    triggerRef: itemContext.triggerRef,
    focusProxyRef: itemContext.focusProxyRef,
    wasEscapeCloseRef: itemContext.wasEscapeCloseRef,
    onContentFocusOutside: itemContext.onContentFocusOutside,
    onRootContentClose: itemContext.onRootContentClose,
    ...contentProps
  };
  return !context.viewport ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Presence, { present: forceMount || open, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    NavigationMenuContentImpl,
    {
      "data-state": getOpenState(open),
      ...commonProps,
      ref: composedRefs,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: composeEventHandlers(
        props.onPointerLeave,
        whenMouse(context.onContentLeave)
      ),
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ...commonProps.style
      }
    }
  ) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ViewportContentMounter, { forceMount, ...commonProps, ref: composedRefs });
});
NavigationMenuContent.displayName = CONTENT_NAME2;
var ViewportContentMounter = React5.forwardRef((props, forwardedRef) => {
  const context = useNavigationMenuContext(CONTENT_NAME2, props.__scopeNavigationMenu);
  const { onViewportContentChange, onViewportContentRemove } = context;
  useLayoutEffect2(() => {
    onViewportContentChange(props.value, {
      ref: forwardedRef,
      ...props
    });
  }, [props, forwardedRef, onViewportContentChange]);
  useLayoutEffect2(() => {
    return () => onViewportContentRemove(props.value);
  }, [props.value, onViewportContentRemove]);
  return null;
});
var ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";
var NavigationMenuContentImpl = React5.forwardRef((props, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    value,
    triggerRef,
    focusProxyRef,
    wasEscapeCloseRef,
    onRootContentClose,
    onContentFocusOutside,
    ...contentProps
  } = props;
  const context = useNavigationMenuContext(CONTENT_NAME2, __scopeNavigationMenu);
  const ref = React5.useRef(null);
  const composedRefs = useComposedRefs(ref, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, value);
  const contentId = makeContentId(context.baseId, value);
  const getItems = useCollection(__scopeNavigationMenu);
  const prevMotionAttributeRef = React5.useRef(null);
  const { onItemDismiss } = context;
  React5.useEffect(() => {
    const content = ref.current;
    if (context.isRootMenu && content) {
      const handleClose = () => {
        onItemDismiss();
        onRootContentClose();
        if (content.contains(document.activeElement)) triggerRef.current?.focus();
      };
      content.addEventListener(ROOT_CONTENT_DISMISS, handleClose);
      return () => content.removeEventListener(ROOT_CONTENT_DISMISS, handleClose);
    }
  }, [context.isRootMenu, props.value, triggerRef, onItemDismiss, onRootContentClose]);
  const motionAttribute = React5.useMemo(() => {
    const items = getItems();
    const values = items.map((item) => item.value);
    if (context.dir === "rtl") values.reverse();
    const index = values.indexOf(context.value);
    const prevIndex = values.indexOf(context.previousValue);
    const isSelected = value === context.value;
    const wasSelected = prevIndex === values.indexOf(value);
    if (!isSelected && !wasSelected) return prevMotionAttributeRef.current;
    const attribute = (() => {
      if (index !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index > prevIndex ? "from-end" : "from-start";
        if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
      }
      return null;
    })();
    prevMotionAttributeRef.current = attribute;
    return attribute;
  }, [context.previousValue, context.value, context.dir, getItems, value]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroup, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    DismissableLayer,
    {
      id: contentId,
      "aria-labelledby": triggerId,
      "data-motion": motionAttribute,
      "data-orientation": context.orientation,
      ...contentProps,
      ref: composedRefs,
      disableOutsidePointerEvents: false,
      onDismiss: () => {
        const rootContentDismissEvent = new Event(ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true
        });
        ref.current?.dispatchEvent(rootContentDismissEvent);
      },
      onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
        onContentFocusOutside();
        const target = event.target;
        if (context.rootNavigationMenu?.contains(target)) event.preventDefault();
      }),
      onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
        const target = event.target;
        const isTrigger = getItems().some((item) => item.ref.current?.contains(target));
        const isRootViewport = context.isRootMenu && context.viewport?.contains(target);
        if (isTrigger || isRootViewport || !context.isRootMenu) event.preventDefault();
      }),
      onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
        const isTabKey = event.key === "Tab" && !isMetaKey;
        if (isTabKey) {
          const candidates = getTabbableCandidates(event.currentTarget);
          const focusedElement = document.activeElement;
          const index = candidates.findIndex((candidate) => candidate === focusedElement);
          const isMovingBackwards = event.shiftKey;
          const nextCandidates = isMovingBackwards ? candidates.slice(0, index).reverse() : candidates.slice(index + 1, candidates.length);
          if (focusFirst(nextCandidates)) {
            event.preventDefault();
          } else {
            focusProxyRef.current?.focus();
          }
        }
      }),
      onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (_event) => {
        wasEscapeCloseRef.current = true;
      })
    }
  ) });
});
var VIEWPORT_NAME = "NavigationMenuViewport";
var NavigationMenuViewport = React5.forwardRef((props, forwardedRef) => {
  const { forceMount, ...viewportProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu);
  const open = Boolean(context.value);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Presence, { present: forceMount || open, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NavigationMenuViewportImpl, { ...viewportProps, ref: forwardedRef }) });
});
NavigationMenuViewport.displayName = VIEWPORT_NAME;
var NavigationMenuViewportImpl = React5.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu);
  const composedRefs = useComposedRefs(forwardedRef, context.onViewportChange);
  const viewportContentContext = useViewportContentContext(
    CONTENT_NAME2,
    props.__scopeNavigationMenu
  );
  const [size, setSize] = React5.useState(null);
  const [content, setContent] = React5.useState(null);
  const viewportWidth = size ? size?.width + "px" : void 0;
  const viewportHeight = size ? size?.height + "px" : void 0;
  const open = Boolean(context.value);
  const activeContentValue = open ? context.value : context.previousValue;
  const handleSizeChange = () => {
    if (content) setSize({ width: content.offsetWidth, height: content.offsetHeight });
  };
  useResizeObserver(content, handleSizeChange);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    Primitive.div,
    {
      "data-state": getOpenState(open),
      "data-orientation": context.orientation,
      ...viewportImplProps,
      ref: composedRefs,
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ["--radix-navigation-menu-viewport-width"]: viewportWidth,
        ["--radix-navigation-menu-viewport-height"]: viewportHeight,
        ...viewportImplProps.style
      },
      onPointerEnter: composeEventHandlers(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse(context.onContentLeave)),
      children: Array.from(viewportContentContext.items).map(([value, { ref, forceMount, ...props2 }]) => {
        const isActive = activeContentValue === value;
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Presence, { present: forceMount || isActive, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          NavigationMenuContentImpl,
          {
            ...props2,
            ref: composeRefs(ref, (node) => {
              if (isActive && node) setContent(node);
            })
          }
        ) }, value);
      })
    }
  );
});
var FOCUS_GROUP_NAME = "FocusGroup";
var FocusGroup = React5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const context = useNavigationMenuContext(FOCUS_GROUP_NAME, __scopeNavigationMenu);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroupCollection.Provider, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroupCollection.Slot, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Primitive.div, { dir: context.dir, ...groupProps, ref: forwardedRef }) }) });
  }
);
var ARROW_KEYS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
var FOCUS_GROUP_ITEM_NAME = "FocusGroupItem";
var FocusGroupItem = React5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const getItems = useFocusGroupCollection(__scopeNavigationMenu);
    const context = useNavigationMenuContext(FOCUS_GROUP_ITEM_NAME, __scopeNavigationMenu);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FocusGroupCollection.ItemSlot, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Primitive.button,
      {
        ...groupProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isFocusNavigationKey = ["Home", "End", ...ARROW_KEYS].includes(event.key);
          if (isFocusNavigationKey) {
            let candidateNodes = getItems().map((item) => item.ref.current);
            const prevItemKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
            const prevKeys = [prevItemKey, "ArrowUp", "End"];
            if (prevKeys.includes(event.key)) candidateNodes.reverse();
            if (ARROW_KEYS.includes(event.key)) {
              const currentIndex = candidateNodes.indexOf(event.currentTarget);
              candidateNodes = candidateNodes.slice(currentIndex + 1);
            }
            setTimeout(() => focusFirst(candidateNodes));
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst(candidates) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
function getOpenState(open) {
  return open ? "open" : "closed";
}
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root22 = NavigationMenu;
var List = NavigationMenuList;
var Item = NavigationMenuItem;
var Trigger2 = NavigationMenuTrigger;
var Link2 = NavigationMenuLink;
var Indicator = NavigationMenuIndicator;
var Content2 = NavigationMenuContent;
var Viewport = NavigationMenuViewport;

// src/components/ui/navigation-menu.jsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
var NavigationMenu2 = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
  Root22,
  {
    ref,
    className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(NavigationMenuViewport2, {})
    ]
  }
));
NavigationMenu2.displayName = Root22.displayName;
var NavigationMenuList2 = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  List,
  {
    ref,
    className: cn("group flex flex-1 list-none items-center justify-center space-x-1", className),
    ...props
  }
));
NavigationMenuList2.displayName = List.displayName;
var NavigationMenuItem2 = Item;
var navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);
var NavigationMenuTrigger2 = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
  Trigger2,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger2.displayName = Trigger2.displayName;
var NavigationMenuContent2 = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  Content2,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    ),
    ...props
  }
));
NavigationMenuContent2.displayName = Content2.displayName;
var NavigationMenuLink2 = Link2;
var NavigationMenuViewport2 = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport2.displayName = Viewport.displayName;
var NavigationMenuIndicator2 = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
  Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator2.displayName = Indicator.displayName;

// src/components/general/ScrollToTop.jsx
var import_react = __toESM(require_react(), 1);
function ScrollToTop() {
  const { pathname } = useLocation();
  (0, import_react.useEffect)(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

// src/components/general/CookieConsentBanner.jsx
var import_react2 = __toESM(require_react(), 1);

// src/components/ui/dialog.jsx
var React7 = __toESM(require_react(), 1);
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var Dialog2 = Root3;
var DialogPortal2 = Portal2;
var DialogOverlay2 = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay2.displayName = Overlay.displayName;
var DialogContent2 = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DialogPortal2, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DialogOverlay2, {}),
  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent2.displayName = Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle2 = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle2.displayName = Title.displayName;
var DialogDescription2 = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription2.displayName = Description.displayName;

// src/components/general/CookieConsentBanner.jsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
function CookieConsentBanner() {
  const [showBanner, setShowBanner] = (0, import_react2.useState)(false);
  const [showManageDialog, setShowManageDialog] = (0, import_react2.useState)(false);
  const [cookiePreferences, setCookiePreferences] = (0, import_react2.useState)({
    essential: true,
    // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [showFloatingManage, setShowFloatingManage] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    const url = new URL(window.location.href);
    const resetParam = url.searchParams.get("consent") === "reset" || url.searchParams.get("cookie_reset") === "1";
    if (resetParam) {
      localStorage.removeItem("cookieConsent");
      localStorage.removeItem("cookiePreferences");
      setShowBanner(true);
      setShowFloatingManage(false);
      return;
    }
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2e3);
      return () => clearTimeout(timer);
    } else {
      setShowFloatingManage(true);
      try {
        const saved = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
        setCookiePreferences((prev) => ({ ...prev, ...saved, essential: true }));
      } catch (error) {
        console.error("Error parsing cookie preferences from localStorage:", error);
      }
    }
  }, []);
  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    setCookiePreferences(allAccepted);
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };
  const handleDeclineAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    localStorage.setItem("cookieConsent", "declined");
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly));
    setCookiePreferences(essentialOnly);
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };
  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", "customized");
    localStorage.setItem("cookiePreferences", JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowManageDialog(false);
    setShowFloatingManage(true);
  };
  const updatePreference = (type, value) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: value
    }));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    showFloatingManage && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      Button,
      {
        variant: "outline",
        onClick: () => setShowManageDialog(true),
        className: "fixed bottom-4 right-4 z-[9999] shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 hover:dark:bg-gray-700",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Settings, { className: "w-4 h-4 mr-2" }),
          "Cookie Settings"
        ]
      }
    ),
    showBanner && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "fixed bottom-0 left-0 right-0 z-[9998] p-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Cookie, { className: "w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "We Use Cookies" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "text-gray-600 dark:text-gray-300 text-sm mb-4", children: [
          "We use cookies to enhance your experience, analyze site usage, and assist with our marketing efforts. Your data is processed in your browser - we don't store any of your financial calculations on our servers.",
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("br", {}),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            Link,
            {
              to: createPageUrl("CookiePolicy"),
              className: "text-blue-600 dark:text-blue-400 hover:underline",
              children: "Learn more about our cookies"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { onClick: handleAcceptAll, className: "bg-blue-600 hover:bg-blue-700", children: "Accept All Cookies" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", onClick: () => setShowManageDialog(true), children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Settings, { className: "w-4 h-4 mr-2" }),
            "Manage Cookies"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "outline", onClick: handleDeclineAll, children: "Decline All" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: handleDeclineAll,
          className: "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(X, { className: "w-5 h-5" })
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Dialog2, { open: showManageDialog, onOpenChange: setShowManageDialog, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(DialogContent2, { className: "max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(DialogTitle2, { className: "text-gray-900 dark:text-gray-100", children: "Manage Cookie Preferences" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-gray-600 dark:text-gray-300 text-sm", children: "Choose which cookies you'd like to accept. You can change these settings at any time." }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Essential Cookies" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Required for basic site functionality. These cannot be disabled." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "ml-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-4 h-4 bg-white rounded-full" }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Analytics Cookies" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Help us understand how visitors use our site to improve user experience." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "ml-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                onClick: () => updatePreference("analytics", !cookiePreferences.analytics),
                className: `w-12 h-6 rounded-full flex items-center transition-colors ${cookiePreferences.analytics ? "bg-blue-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"}`,
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-4 h-4 bg-white rounded-full mx-1" })
              }
            ) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Marketing Cookies" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Used to track visitors for advertising and marketing purposes." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "ml-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                onClick: () => updatePreference("marketing", !cookiePreferences.marketing),
                className: `w-12 h-6 rounded-full flex items-center transition-colors ${cookiePreferences.marketing ? "bg-blue-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"}`,
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-4 h-4 bg-white rounded-full mx-1" })
              }
            ) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Preference Cookies" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Remember your settings and preferences (like dark mode)." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "ml-4", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                onClick: () => updatePreference("preferences", !cookiePreferences.preferences),
                className: `w-12 h-6 rounded-full flex items-center transition-colors ${cookiePreferences.preferences ? "bg-blue-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"}`,
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-4 h-4 bg-white rounded-full mx-1" })
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "outline", onClick: handleDeclineAll, children: "Decline All" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { onClick: handleSavePreferences, className: "bg-blue-600 hover:bg-blue-700", children: "Save Preferences" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { onClick: handleAcceptAll, className: "bg-green-600 hover:bg-green-700", children: "Accept All" })
        ] })
      ] })
    ] }) })
  ] });
}

// src/components/data/pageSeo.js
var pageSeo = {
  Home: {
    title: "UK Salary, Tax & Mortgage Calculators | Calculate My Money",
    description: "Free UK calculators for take-home pay, tax, NI, mortgages, savings and ROI. Fast, accurate tools for 2025/26."
  },
  Resources: {
    title: "Financial Resources & Guides | Calculate My Money",
    description: "Explore our financial resources and guides on Calculate My Money. Learn about tax, savings, investments, and personal finance in the UK."
  },
  Blog: {
    title: "Financial Blog | Insights & Articles - Calculate My Money",
    description: "Read the latest articles and insights on UK personal finance, tax, budgeting, and investment strategies from the Calculate My Money blog."
  },
  BlogSmartMoneySavingTips: {
    title: "Smart Money-Saving Tips for UK Families | Calculate My Money",
    description: "Discover practical tips for UK families to save money on groceries, energy bills, and everyday expenses. A complete guide to cut costs and budget effectively.",
    ogType: "article",
    ogImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ogImageAlt: "A family happily unpacking groceries in a bright, modern kitchen.",
    twitterImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    twitterImageAlt: "A family happily unpacking groceries in a bright, modern kitchen.",
    publishedTime: "2023-10-26T08:00:00+00:00",
    modifiedTime: "2023-10-26T08:00:00+00:00",
    author: "CalcMyMoney Team",
    section: "Money Saving",
    tags: ["Money Saving", "Family Budgeting", "Energy Bills", "UK Finance"]
  },
  BlogDebtRepaymentStrategies: {
    title: "Debt Snowball vs. Avalanche in the UK | Calculate My Money",
    description: "Compare the Debt Snowball and Debt Avalanche methods. Find the best strategy to pay off your debts in the UK, from credit cards to loans.",
    ogType: "article",
    ogImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ogImageAlt: "Person organizing financial documents and calculating debt payments",
    twitterImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    twitterImageAlt: "Person organizing financial documents and calculating debt payments",
    publishedTime: "2023-10-24T08:00:00+00:00",
    modifiedTime: "2023-10-24T08:00:00+00:00",
    author: "CalcMyMoney Team",
    section: "Debt Management",
    tags: ["Debt Repayment", "Personal Finance", "UK Debt Advice", "Budgeting"]
  },
  BlogFinancialPsychology: {
    title: "Your Relationship with Money: A Guide to Financial Psychology",
    description: "Understand the psychology behind your spending and saving habits. Learn how your money mindset impacts your financial health and future prosperity in the UK.",
    ogType: "article",
    ogImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ogImageAlt: "Person meditating with financial symbols and growth charts in the background",
    twitterImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    twitterImageAlt: "Person meditating with financial symbols and growth charts in the background",
    publishedTime: "2023-10-22T08:00:00+00:00",
    modifiedTime: "2023-10-22T08:00:00+00:00",
    author: "CalcMyMoney Team",
    section: "Mindset",
    tags: ["Financial Psychology", "Money Mindset", "Behavioural Finance", "Personal Finance"]
  },
  Contact: {
    title: "Contact Us | Calculate My Money",
    description: "Get in touch with Calculate My Money for support, feedback, or business inquiries. We're here to help with your financial calculator needs."
  },
  PrivacyPolicy: {
    title: "Privacy Policy | Calculate My Money",
    description: "Understand our Privacy Policy at Calculate My Money. Learn how we collect, use, and protect your personal data."
  },
  CookiePolicy: {
    title: "Cookie Policy | Calculate My Money",
    description: "Review our Cookie Policy at Calculate My Money to understand how we use cookies on our website."
  },
  TermsOfService: {
    title: "Terms of Service | Calculate My Money",
    description: "Read the Terms of Service for Calculate My Money. By using our website, you agree to these terms."
  },
  Disclaimer: {
    title: "Disclaimer | Calculate My Money",
    description: "Important disclaimer regarding the use of financial calculators and information provided on Calculate My Money."
  },
  Sitemap: {
    title: "Sitemap | Calculate My Money",
    description: "Browse the sitemap for Calculate My Money to find all available financial calculators and resources."
  },
  SalaryCalculatorUK: {
    title: "UK Salary Calculator (Take-Home Pay 2025/26)",
    description: "Calculate your UK take-home pay after tax and NI for 2025/26. Includes paycheck, pro-rata and gross-to-net tools."
  },
  SalaryCalculatorTakeHomePay: {
    title: "Take-Home Pay Calculator UK (2025/26)",
    description: "Estimate UK take-home pay after tax, NI, pension & student loans for 2025/26."
  },
  SalaryCalculatorPaycheck: {
    title: "Paycheck Calculator UK (After Tax & NI)",
    description: "Work out your UK paycheck after tax and NI. Supports weekly, fortnightly and monthly pay."
  },
  GrossToNetCalculator: {
    title: "Gross to Net Income Calculator UK",
    description: "Convert gross salary to net take-home pay with UK tax and NI for 2025/26."
  },
  ProRataSalaryCalculator: {
    title: "Pro-Rata Salary Calculator UK",
    description: "Convert annual salary to pro-rata pay by hours or days worked in the UK."
  },
  MortgageCalculator: {
    title: "UK Mortgage Calculator | Repayments & Affordability - Calculate My Money",
    description: "Estimate your UK mortgage repayments and check affordability with our free mortgage calculator. See monthly costs, interest, and the full amortization schedule."
  },
  BudgetCalculator: {
    title: "Budget Planner UK | Free Online Budgeting Tool - Calculate My Money",
    description: "Create a personal budget with our free UK budget planner. Track income and expenses to manage your finances effectively."
  },
  CompoundInterestCalculator: {
    title: "Compound Interest Calculator UK | Grow Your Savings - Calculate My Money",
    description: "See how your savings can grow with our UK compound interest calculator. Plan for future investments and financial goals."
  },
  PensionCalculator: {
    title: "UK Pension Calculator | Plan Your Retirement - Calculate My Money",
    description: "Estimate your future pension income with our UK pension calculator. Plan for a secure retirement."
  },
  NationalInsuranceCalculator: {
    title: "UK National Insurance Calculator 2025/26 | Calculate Your NI",
    description: "Calculate your UK National Insurance contributions for the 2025/26 tax year. Our free NI calculator shows you exactly what you'll pay based on your salary."
  },
  MaternityPayCalculator: {
    title: "Statutory Maternity Pay Calculator UK 2025 | SMP Estimator",
    description: "Estimate your Statutory Maternity Pay (SMP) with our free UK calculator. See how much you'll receive for the 39 weeks of your maternity leave."
  },
  SeverancePayCalculator: {
    title: "UK Severance Pay Calculator | Redundancy & Exit Package Estimate",
    description: "Estimate UK severance pay including statutory redundancy, notice pay, unused holiday and contractual enhancements."
  },
  InflationCalculator: {
    title: "UK Inflation Calculator | Calculate the Changing Value of Money",
    description: "See how the value of the pound has changed over time with our free UK inflation calculator. Compare the purchasing power of money between any two years."
  },
  IncomeTaxCalculator: {
    title: "UK Income Tax Calculator 2025/26 | Calculate Your Tax Bill - Calculate My Money",
    description: "Calculate your income tax for 2025/26 with our free UK tax calculator. Covers tax bands for England, Scotland, Wales & NI. Find out your true tax liability."
  },
  SalaryIncreaseCalculator: {
    title: "Salary Increase Calculator UK | See Your New Pay - Calculate My Money",
    description: "Calculate how a percentage-based pay rise will affect your annual and monthly gross income with our simple salary increase calculator."
  },
  SimpleInterestCalculator: {
    title: "Simple Interest Calculator UK | Calculate My Money",
    description: "Use our simple interest calculator to quickly determine the interest earned on a principal sum over a fixed period without compounding."
  },
  EffectiveTaxRateCalculator: {
    title: "Effective Tax Rate Calculator UK | Your True Tax Rate - Calculate My Money",
    description: "Find your true, overall tax burden. Our calculator shows your effective tax rate after factoring in your personal allowance, income tax, and NI."
  },
  HomeEquityLoanCalculator: {
    title: "Home Equity Loan Calculator UK | How Much Can You Borrow? - Calculate My Money",
    description: "Estimate how much equity you can borrow from your home with our free UK home equity loan calculator. Understand your LTV and available funds."
  },
  AnnuityCalculator: {
    title: "Annuity Calculator UK | Estimate Your Retirement Income - Calculate My Money",
    description: "Use our annuity calculator to estimate the guaranteed income you could receive from your pension pot for a fixed term or for life."
  },
  CommissionCalculator: {
    title: "Commission Calculator UK | Calculate Sales Earnings - Calculate My Money",
    description: "Easily calculate your gross commission earnings based on sales revenue and commission percentage with our free online tool."
  },
  DividendTaxCalculator: {
    title: "UK Dividend Tax Calculator 2024/25 | Calculate My Money",
    description: "Estimate your tax liability on dividend income for the 2024/25 tax year. Accounts for allowances and income tax bands."
  },
  FutureValueCalculator: {
    title: "Future Value Calculator | Project Your Investment's Worth - Calculate My Money",
    description: "Calculate the future value of a single lump-sum investment based on a constant interest rate over a specific period."
  },
  OvertimePayCalculator: {
    title: "Overtime Pay Calculator UK | Calculate Your Extra Earnings - Calculate My Money",
    description: "Work out your gross pay including overtime hours. Set your standard rate, overtime hours, and pay multiplier to see your total earnings."
  },
  LoanComparisonCalculator: {
    title: "Loan Comparison Calculator UK | Find The Better Deal - Calculate My Money",
    description: "Compare two loan offers side-by-side to determine the true cost. Analyze monthly payments, total interest, and the total amount repaid."
  },
  InheritanceTaxCalculator: {
    title: "Inheritance Tax Calculator UK | IHT Estimator - Calculate My Money",
    description: "Estimate your potential Inheritance Tax (IHT) liability with our easy-to-use UK calculator. Understand the nil-rate bands."
  },
  CouncilTaxCalculator: {
    title: "Council Tax Calculator UK | Estimate Your Bill - Calculate My Money",
    description: "Get an estimate of your annual Council Tax bill based on your property's band. Covers average rates for England."
  },
  MortgageRepaymentCalculator: {
    title: "Mortgage Repayment Schedule Calculator | Amortization - Calculate My Money",
    description: "Generate a full mortgage repayment (amortization) schedule. See the breakdown of principal and interest and interest for each payment."
  },
  FirstTimeBuyerCalculator: {
    title: "First-Time Buyer Calculator UK | Affordability & Costs - Calculate My Money",
    description: "Assess your affordability as a first-time buyer. Calculate your loan-to-income ratio, deposit percentage, and estimated stamp duty."
  },
  RentalYieldCalculator: {
    title: "Rental Yield Calculator UK | Gross & Net Yield - Calculate My Money",
    description: "Calculate gross and net rental yield, annual cash flow and cash-on-cash return for UK buy-to-let properties. Understand the true performance of your rental investment."
  },
  RentVsBuyCalculator: {
    title: "Rent vs Buy Calculator UK | Financial Comparison - Calculate My Money",
    description: "Compare the estimated monthly costs of renting a property versus buying a home to help you make an informed financial decision."
  },
  HouseholdBillsSplitter: {
    title: "Household Bill Splitter Calculator | Calculate My Money",
    description: "Easily split rent, utilities, and other shared household expenses between multiple people with our simple bill splitting tool."
  },
  CommuteCostCalculator: {
    title: "Commute Cost Calculator UK | Fuel & Transport Costs - Calculate My Money",
    description: "Calculate the weekly and monthly cost of your commute, factoring in fuel consumption, prices, and public transport expenses."
  },
  CarCostCalculator: {
    title: "True Cost of Car Ownership Calculator UK | Calculate My Money",
    description: "Calculate the total cost of owning a car, including depreciation, fuel, insurance, tax, and maintenance over your ownership term."
  },
  SubscriptionCostCalculator: {
    title: "Subscription Cost Calculator | Track Your Spending - Calculate My Money",
    description: "Track all your monthly and annual subscriptions in one place to see the total cost and find areas to save money."
  },
  RuleOf72Calculator: {
    title: "Rule of 72 Calculator | Doubling Time for Investments - Calculate My Money",
    description: "Use the Rule of 72 to quickly estimate how many years it will take for your investment to double at a given rate of return."
  },
  StudentLoanRepaymentCalculator: {
    title: "Student Loan Repayment Calculator UK (All Plans) | Calculate My Money",
    description: "Calculate your estimated monthly and annual student loan repayments based on your salary and specific UK loan plan (Plan 1, 2, 4, 5, or Postgraduate)."
  },
  WeddingBudgetCalculator: {
    title: "Wedding Budget Calculator & Tracker | Calculate My Money",
    description: "Plan and track your wedding expenses with our comprehensive budget calculator. Manage your spending across all categories."
  },
  TravelBudgetCalculator: {
    title: "Travel & Holiday Budget Calculator | Calculate My Money",
    description: "Plan your next holiday with our easy-to-use travel budget calculator. Estimate costs for flights, accommodation, food, and activities."
  },
  ChildcareCostCalculator: {
    title: "Childcare Cost Calculator UK | Nursery Fees Estimator - Calculate My Money",
    description: "Estimate the weekly, monthly, and annual cost of childcare based on daily rates and the number of days required."
  },
  ChildBenefitCalculator: {
    title: "UK Child Benefit Calculator | High Income Charge & Payments",
    description: "Check your weekly Child Benefit payments, see any High Income Child Benefit Charge and estimate how much you keep."
  },
  TipCalculator: {
    title: "UK Tip & Bill Splitting Calculator | Calculate My Money",
    description: "Easily calculate a tip and split the total bill between any number of people. Perfect for dining out in the UK."
  },
  OvertimeRateCalculator: {
    title: "Overtime Rate Calculator UK | Calculate My Money",
    description: "Calculate your hourly pay rate for overtime work based on your standard rate and contract multiplier (e.g., time-and-a-half)."
  },
  CurrencyConverter: {
    title: "Currency Converter & Exchange Rate Hub | Calculate My Money",
    description: "Understand currency exchange and find links to reliable, live exchange rates for GBP, USD, EUR, and more. An educational tool for travellers and investors."
  },
  UKGovernmentBudget: {
    title: "UK Government Budget Analysis | Calculate My Money",
    description: "Detailed analysis of the latest UK Government Budget announcements and their impact on your finances and calculators."
  },
  UKFinancialStats: {
    title: "Live UK Financial Statistics Dashboard | BoE Rate, Inflation, House Prices",
    description: "Track key UK economic indicators in real-time. Our dashboard provides the latest Bank of England interest rate, inflation (CPI), house prices, and more."
  },
  JobSalaries: {
    title: "Average Job Salaries UK | By Industry & Region - Calculate My Money",
    description: "Discover average job salaries across various industries and regions in the UK. Compare earnings and career prospects with our tools."
  },
  CostOfLiving: {
    title: "Cost of Living UK | City & Regional Breakdown - Calculate My Money",
    description: "Explore the cost of living in various UK cities and regions. Understand typical expenses for housing, food, and transport with our data."
  },
  Methodology: {
    title: "Methodology & Data Sources (HMRC, BoE) | Calculate My Money",
    description: "How we calculate UK salary, tax and mortgage results. Data sources: HMRC 2025/26, Bank of England."
  },
  About: {
    title: "About Calculate My Money \u2013 UK Financial Calculators",
    description: "Who we are and how we build accurate, transparent UK financial calculators."
  },
  TaxCalculatorsUK: {
    title: "UK Tax Calculators Hub | Income Tax, NI, Net Income",
    description: "Explore UK tax tools for 2025/26: Income Tax after tax, Tax + NI, Net Income and Self Assessment guides."
  },
  TaxAfterTaxCalculator: {
    title: "Tax After Tax Calculator UK | 2025/26",
    description: "Work out your UK tax after tax for the 2025/26 year. Clear band-by-band breakdowns."
  },
  TaxAndNICalculator: {
    title: "Tax and NI Calculator UK | Combined Deductions 2025/26",
    description: "Calculate combined UK Income Tax and National Insurance for 2025/26."
  },
  NetIncomeUKCalculator: {
    title: "Net Income Calculator UK | Take-Home After Tax & NI",
    description: "Estimate your UK net income after tax and NI deductions for 2025/26."
  },
  SelfAssessmentGuide: {
    title: "UK Self Assessment Guide | Deadlines, Rates, Tips",
    description: "Understand UK Self Assessment: deadlines, allowances, rates and tips for 2025/26."
  },
  MortgageCalculatorUK: {
    title: "UK Mortgage Calculators Hub | Repayments, Comparison",
    description: "Explore UK mortgage tools: loan repayment, comparisons, and home loan calculators for 2025/26."
  },
  MortgageLoanRepayment: {
    title: "Mortgage Loan Repayment Calculator UK",
    description: "Estimate monthly mortgage repayments and total interest across the term."
  },
  HomeLoanMortgageCalculator: {
    title: "Home Loan Mortgage Calculator UK",
    description: "Quick home loan mortgage estimates: payments by rate, term and deposit."
  },
  MortgageComparison: {
    title: "Mortgage Comparison Calculator UK",
    description: "Compare two mortgage deals side-by-side. See total costs and savings."
  }
  // Add entries for other specific pages/calculators here following the same pattern
};
var CDN = "https://xifmvsuddgebmlleggqz.supabase.co/storage/v1/object/public/CalcMyMoney.co.uk";
pageSeo.SalaryCalculatorUK = {
  ...pageSeo.SalaryCalculatorUK,
  ogImage: `${CDN}/og-final-salary-hub.png`,
  ogImageAlt: "UK Salary Calculator \u2013 Take-Home Pay (2025/26)"
};
pageSeo.SalaryCalculatorTakeHomePay = {
  ...pageSeo.SalaryCalculatorTakeHomePay,
  ogImage: `${CDN}/og-final-take-home.png`,
  ogImageAlt: "Take-Home Pay Calculator UK (2025/26)"
};
pageSeo.SalaryCalculatorPaycheck = {
  ...pageSeo.SalaryCalculatorPaycheck,
  ogImage: `${CDN}/og-final-paycheck.png`,
  ogImageAlt: "Paycheck Calculator UK \u2013 After Tax & NI"
};
pageSeo.GrossToNetCalculator = {
  ...pageSeo.GrossToNetCalculator,
  ogImage: `${CDN}/og-final-gross-to-net.png`,
  ogImageAlt: "Gross to Net Income Calculator (UK)"
};
pageSeo.ProRataSalaryCalculator = {
  ...pageSeo.ProRataSalaryCalculator,
  ogImage: `${CDN}/og-final-pro-rata.png`,
  ogImageAlt: "Pro-Rata Salary Calculator (UK)"
};
var defaultOgImage = "https://xifmvsuddgebmlleggqz.supabase.co/storage/v1/object/public/CalcMyMoney.co.uk/og-default.png";
var defaultOgAlt = "Calculate My Money \u2013 Free UK Calculators";

// src/components/general/CalculatorIndex.jsx
var import_react3 = __toESM(require_react(), 1);
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
function CalculatorIndex() {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("section", { className: "bg-white border-t border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("details", { className: "group", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("summary", { className: "cursor-pointer list-none", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-colors", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "text-lg md:text-xl font-semibold text-gray-900", children: "Browse all calculators (A\u2013Z by category)" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-sm text-gray-600", children: "Open this index to quickly jump to any tool across the site." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-blue-600 text-sm font-medium", children: "Show/Hide" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "mt-6 space-y-10", children: calculatorCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: category.name }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-gray-500", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "a",
          {
            href: `${createPageUrl("Home")}#${category.slug}`,
            className: "text-blue-600 hover:underline",
            children: "View on directory"
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: category.subCategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: sub.name }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "space-y-1", children: sub.calculators.filter((c) => c.status === "active").map((calc) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Link,
          {
            to: calc.url,
            className: "text-blue-600 hover:text-blue-800 hover:underline text-sm",
            children: calc.name
          }
        ) }, calc.name)) })
      ] }, sub.name)) })
    ] }, category.slug)) })
  ] }) }) });
}

// src/components/calculators/RelatedAuto.jsx
var import_react4 = __toESM(require_react(), 1);
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
function RelatedAuto() {
  const location = useLocation();
  const pathname = location?.pathname || "";
  const related = (0, import_react4.useMemo)(() => getRelatedCalculators(pathname, { max: 3 }), [pathname]);
  const [showAuto, setShowAuto] = (0, import_react4.useState)(false);
  (0, import_react4.useLayoutEffect)(() => {
    if (typeof document === "undefined") return;
    const existing = document.querySelector("[data-related-calculators]");
    setShowAuto(!existing);
  }, [pathname]);
  if (!showAuto || !Array.isArray(related) || related.length === 0) return null;
  const calculatorsProp = [
    ...related.map((c) => ({ name: c.name, url: c.url, description: c.description })),
    { name: "UK Financial Stats", url: "/uk-financial-stats", description: "Live BoE, CPIH, HPI & Ofgem cap." }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(RelatedCalculators, { calculators: calculatorsProp });
}

// src/pages/Layout.jsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var COST_OF_LIVING_BASE_PATH = createPageUrl("CostOfLiving");
function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react5.useState)(false);
  const [openCategories, setOpenCategories] = (0, import_react5.useState)({});
  const [seoOverrides, setSeoOverrides] = (0, import_react5.useState)({});
  const isHomePage = location.pathname === createPageUrl("Home");
  const costOfLivingBaseSlug = (0, import_react5.useMemo)(
    () => COST_OF_LIVING_BASE_PATH.replace(/^\/+|\/+$/g, ""),
    []
  );
  const getCostOfLivingSlug = (0, import_react5.useCallback)(() => {
    const pathnameSegments = (location.pathname || "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    if (pathnameSegments[0] === costOfLivingBaseSlug && pathnameSegments[1]) {
      const segment = pathnameSegments[1];
      try {
        return decodeURIComponent(segment).toLowerCase();
      } catch (error) {
        return segment.toLowerCase();
      }
    }
    const params = new URLSearchParams(location.search || "");
    const slugFromQuery = params.get("slug");
    return slugFromQuery ? slugFromQuery.trim().toLowerCase() : "";
  }, [costOfLivingBaseSlug, location.pathname, location.search]);
  const rawOrigin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://www.calcmymoney.co.uk";
  const normalizedOrigin = rawOrigin.endsWith("/") ? rawOrigin.slice(0, -1) : rawOrigin;
  const canonicalUrl = (0, import_react5.useMemo)(() => {
    const pathname = location.pathname || "/";
    if (currentPageName === "Home" || pathname === "/") {
      return `${normalizedOrigin}/`;
    }
    const searchCanonicalPages = /* @__PURE__ */ new Set(["JobSalaries"]);
    if (searchCanonicalPages.has(currentPageName)) {
      const params = new URLSearchParams(location.search || "");
      const slug = params.get("slug");
      const canonicalParams = new URLSearchParams();
      if (slug) {
        canonicalParams.set("slug", slug);
      }
      const search = canonicalParams.toString();
      return `${normalizedOrigin}${pathname}${search ? `?${search}` : ""}`;
    }
    return `${normalizedOrigin}${pathname}`;
  }, [currentPageName, location.pathname, location.search, normalizedOrigin]);
  const pageData = pageSeo[currentPageName] || {};
  const jsonLd = (0, import_react5.useMemo)(() => {
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Calculate My Money",
        url: `${normalizedOrigin}/`,
        logo: "https://www.calcmymoney.co.uk/logo-high-res.webp",
        sameAs: []
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Calculate My Money",
        url: `${normalizedOrigin}/`,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${normalizedOrigin}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ];
    return schemas;
  }, [currentPageName, normalizedOrigin]);
  const defaultSeo = (0, import_react5.useMemo)(() => {
    const defaultTitle = "Calculate My Money - Free UK Financial Calculators";
    const defaultDescription = "Your go-to source for free UK financial calculators including salary, tax, mortgage, pension, and budget tools from Calculate My Money. Make smart money decisions.";
    const title2 = pageData.title || defaultTitle;
    const description2 = pageData.description || defaultDescription;
    return {
      title: title2,
      description: description2,
      canonical: canonicalUrl,
      robots: pageData.robots || "index,follow,max-image-preview:large",
      themeColor: "#0b5fff",
      ogTitle: pageData.ogTitle || title2,
      ogDescription: pageData.ogDescription || description2,
      ogType: pageData.ogType || "website",
      ogUrl: canonicalUrl,
      ogImage: pageData.ogImage || defaultOgImage,
      ogImageAlt: pageData.ogImageAlt || defaultOgAlt,
      ogSiteName: "Calculate My Money",
      ogLocale: "en_GB",
      twitterCard: pageData.twitterCard || "summary_large_image",
      twitterTitle: pageData.twitterTitle || title2,
      twitterDescription: pageData.twitterDescription || description2,
      twitterImage: pageData.twitterImage || pageData.ogImage || defaultOgImage,
      twitterImageAlt: pageData.twitterImageAlt || pageData.ogImageAlt || defaultOgAlt,
      articlePublishedTime: pageData.publishedTime,
      articleModifiedTime: pageData.modifiedTime || pageData.publishedTime,
      articleSection: pageData.section,
      articleAuthor: pageData.author,
      articleTags: pageData.tags,
      jsonLd
    };
  }, [canonicalUrl, jsonLd, pageData]);
  const setSeo = (0, import_react5.useCallback)((updates) => {
    if (!updates) return;
    setSeoOverrides((prev) => {
      const nextUpdates = typeof updates === "function" ? updates(prev) : updates;
      if (!nextUpdates) {
        return prev;
      }
      const next = { ...prev };
      let changed = false;
      Object.entries(nextUpdates).forEach(([key, value]) => {
        if (value === void 0) {
          if (key in next) {
            delete next[key];
            changed = true;
          }
          return;
        }
        if (next[key] !== value) {
          next[key] = value;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);
  const resetSeo = (0, import_react5.useCallback)(() => {
    setSeoOverrides({});
  }, []);
  (0, import_react5.useEffect)(() => {
    resetSeo();
  }, [location.pathname, location.search, resetSeo]);
  const mergedSeo = (0, import_react5.useMemo)(() => {
    const base = { ...defaultSeo };
    Object.entries(seoOverrides).forEach(([key, value]) => {
      if (value === void 0) {
        return;
      }
      base[key] = value;
    });
    return base;
  }, [defaultSeo, seoOverrides]);
  const seoContextValue = (0, import_react5.useMemo)(
    () => ({ seo: mergedSeo, defaults: defaultSeo, overrides: seoOverrides, setSeo, resetSeo }),
    [mergedSeo, defaultSeo, seoOverrides, setSeo, resetSeo]
  );
  const toggleCategory = (categorySlug) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
  };
  const [needsFallbackH1, setNeedsFallbackH1] = (0, import_react5.useState)(false);
  const fallbackH1Pages = import_react5.default.useMemo(
    () => /* @__PURE__ */ new Set([
      "Contact",
      "StampDutyCalculator",
      "PAYECalculator",
      "CostOfLiving",
      // hub page
      "CostOfLivingPage",
      // dynamic city page
      "StudentLoanRepaymentCalculator",
      "NationalInsuranceCalculator"
    ]),
    []
  );
  const toTitleCase = (str) => (str || "").split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const getFallbackH1Text = () => {
    switch (currentPageName) {
      case "Contact":
        return "Contact Us";
      case "StampDutyCalculator":
        return "Stamp Duty Calculator";
      case "PAYECalculator":
        return "UK PAYE Calculator";
      case "CostOfLiving": {
        const slug = getCostOfLivingSlug();
        return slug ? `Cost of Living in ${toTitleCase(slug)}` : "UK Cost of Living Explorer";
      }
      case "CostOfLivingPage": {
        const slug = getCostOfLivingSlug();
        return slug ? `Cost of Living in ${toTitleCase(slug)}` : "UK Cost of Living Explorer";
      }
      case "StudentLoanRepaymentCalculator":
        return "Student Loan Repayment Calculator";
      case "NationalInsuranceCalculator":
        return "UK National Insurance Calculator";
      default:
        const pageData2 = pageSeo[currentPageName];
        if (pageData2?.title) {
          return pageData2.title.split("|")[0].trim();
        }
        return currentPageName || "Calculator";
    }
  };
  (0, import_react5.useEffect)(() => {
    if (!fallbackH1Pages.has(currentPageName)) {
      setNeedsFallbackH1(false);
      return;
    }
    const mainEl = document.querySelector("main");
    const checkForH1 = () => {
      const hasH1 = !!(mainEl && mainEl.querySelector("h1"));
      setNeedsFallbackH1(!hasH1);
    };
    checkForH1();
    const observer = new MutationObserver(() => {
      const hasH1 = !!(mainEl && mainEl.querySelector("h1"));
      if (hasH1) {
        setNeedsFallbackH1(false);
        observer.disconnect();
      } else {
        setNeedsFallbackH1(true);
      }
    });
    if (mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [currentPageName, location.pathname, fallbackH1Pages]);
  (0, import_react5.useEffect)(() => {
    const gaMeasurementId = "G-ESNP2YRGWB";
    const preconnects = [];
    const addPreconnect = (href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      if (href.startsWith("https://")) {
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
      preconnects.push(link);
    };
    addPreconnect("https://www.googletagmanager.com");
    addPreconnect("https://images.unsplash.com");
    addPreconnect("https://qtrypzzcjebvfcihiynt.supabase.co");
    addPreconnect("https://xifmvsuddgebmlleggqz.supabase.co");
    if (gaMeasurementId.startsWith("G-")) {
      const script1 = document.createElement("script");
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      script1.async = true;
      document.head.appendChild(script1);
      const script2 = document.createElement("script");
      script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `;
      document.head.appendChild(script2);
      return () => {
        if (document.head.contains(script1)) {
          document.head.removeChild(script1);
        }
        if (document.head.contains(script2)) {
          document.head.removeChild(script2);
        }
        preconnects.forEach((link) => {
          if (document.head.contains(link)) document.head.removeChild(link);
        });
      };
    }
  }, []);
  (0, import_react5.useEffect)(() => {
    if (typeof window !== "undefined" && window.gtag && /Calculator/i.test(currentPageName || "")) {
      window.gtag("event", "calculator_view", {
        page_name: currentPageName,
        page_path: window.location.pathname,
        page_title: document.title
      });
    }
  }, [currentPageName]);
  const mainNavLinks = [
    { name: "All Calculators", url: createPageUrl("home") },
    { name: "Job Salaries", url: createPageUrl("job-salaries") },
    { name: "Cost of Living", url: createPageUrl("cost-of-living") },
    { name: "Financial Stats", url: createPageUrl("uk-financial-stats") },
    { name: "Blog", url: createPageUrl("blog") },
    { name: "Resources", url: createPageUrl("resources") }
  ];
  const isActiveLink = (0, import_react5.useCallback)(
    (url) => {
      if (!url) return false;
      if (url === "/") {
        return location.pathname === "/" || location.pathname === "";
      }
      return location.pathname === url || location.pathname.startsWith(`${url}/`);
    },
    [location.pathname]
  );
  const navLinkBaseClass = "relative inline-flex items-center px-1 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SeoProvider, { value: seoContextValue, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ScrollToTop, {}),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SeoHead, { ...mergedSeo }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("style", { jsx: true, global: true, children: `
          html {
            scroll-behavior: smooth;
          }
          * {
            transition:
              background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
          }
          @media print {
            html {
              scroll-behavior: auto;
            }
            .non-printable {
              display: none !important;
            }
            .printable-area {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              flex: 1 !important;
            }
            .printable-grid-cols-1 {
              grid-template-columns: 1fr !important;
            }
            .printable-content {
              padding: 0 !important;
              margin: 0 !important;
            }
            .print-title {
              display: block !important;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 2rem;
            }
          }
        ` }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("header", { className: "sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-sm non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("nav", { className: "max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Link, { to: createPageUrl("Home"), className: "flex items-center space-x-2", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: "/logo-high-res.webp", alt: "Calculate My Money Logo", className: "h-8 w-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xl font-bold text-foreground", children: "Calculate My Money" }),
        " "
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(NavigationMenu2, { className: "ml-6 hidden md:flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(NavigationMenuList2, { className: "flex items-center gap-1", children: mainNavLinks.map((link) => {
          const active = isActiveLink(link.url);
          return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(NavigationMenuItem2, { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(NavigationMenuLink2, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            Link,
            {
              to: link.url,
              className: `${navLinkBaseClass} ${active ? "text-foreground after:scale-x-100" : ""}`,
              "aria-current": active ? "page" : void 0,
              children: link.name
            }
          ) }) }, link.name);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(NavigationMenuIndicator2, { className: "hidden md:flex" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex items-center md:hidden", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Sheet, { open: mobileMenuOpen, onOpenChange: setMobileMenuOpen, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SheetTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { variant: "ghost", size: "icon", className: "text-muted-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Menu, { className: "h-6 w-6" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(SheetContent, { className: "w-[300px] overflow-y-auto border-border bg-background sm:w-[340px]", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            Link,
            {
              to: createPageUrl("Home"),
              className: "flex items-center space-x-2",
              onClick: () => setMobileMenuOpen(false),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: "/logo-high-res.webp", alt: "Calculate My Money Logo", className: "h-8 w-8" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xl font-bold text-foreground", children: "Calculate My Money" })
              ]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mt-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "space-y-4 mb-6", children: mainNavLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SheetClose, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: link.url,
                className: "block py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary",
                children: link.name
              }
            ) }, link.name)) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Separator2, { className: "my-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { className: "mb-3 font-semibold text-foreground", children: "Browse Calculators" }),
              calculatorCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
                Collapsible,
                {
                  open: openCategories[category.slug],
                  onOpenChange: () => toggleCategory(category.slug),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(CollapsibleTrigger2, { className: "flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-neutral-soft", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(category.icon, { className: "h-4 w-4" }),
                        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "font-medium text-foreground", children: category.name })
                      ] }),
                      openCategories[category.slug] ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CollapsibleContent2, { className: "pl-6 mt-2 space-y-3", children: category.subCategories.map((subCategory) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "border-b border-card-muted pb-1 text-sm font-medium text-muted-foreground", children: subCategory.name }),
                      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "space-y-1 pl-2", children: subCategory.calculators.map((calc) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(SheetClose, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
                        Link,
                        {
                          to: calc.url,
                          className: `block py-1 text-sm transition-colors ${calc.status === "active" ? "text-muted-foreground hover:text-primary" : "cursor-not-allowed text-muted-foreground/60"}`,
                          children: [
                            calc.name,
                            " ",
                            calc.status === "planned" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xs", children: "(soon)" })
                          ]
                        }
                      ) }, calc.name)) })
                    ] }, subCategory.name)) })
                  ]
                },
                category.slug
              ))
            ] })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("main", { className: "flex-1 bg-background printable-content", children: [
      needsFallbackH1 && fallbackH1Pages.has(currentPageName) && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "non-printable border-b border-border bg-card", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-foreground", children: getFallbackH1Text() }) }) }),
      children,
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(RelatedAuto, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CalculatorIndex, {}),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("footer", { className: "mt-16 border-t border-border bg-background non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid md:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "md:col-span-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Link, { to: createPageUrl("Home"), className: "flex items-center space-x-2 mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("img", { src: "/logo-high-res.webp", alt: "Calculate My Money Logo", className: "h-8 w-8" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-xl font-bold text-foreground", children: "Calculate My Money" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-muted-foreground", children: "Free UK financial calculators for salary, tax, mortgages, pensions, budgets and investments." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "mb-4 font-semibold text-foreground", children: "Popular Calculators" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("ul", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("salary-calculator-uk"),
                className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
                children: "Salary Calculator"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("mortgage-calculator"),
                className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
                children: "Mortgage Calculator"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("budget-calculator"),
                className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
                children: "Budget Planner"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("compound-interest-calculator"),
                className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
                children: "Compound Interest"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("pension-calculator"),
                className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
                children: "Pension Calculator"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "mb-4 font-semibold text-foreground", children: "Categories" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("ul", { className: "space-y-2 text-muted-foreground", children: calculatorCategories.slice(0, 6).map((category) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: isHomePage ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "a",
            {
              href: `#${category.slug}`,
              className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
              children: category.name
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            Link,
            {
              to: `${createPageUrl("Home")}#${category.slug}`,
              className: "text-muted-foreground transition-colors hover:text-primary hover:underline",
              children: category.name
            }
          ) }, category.slug)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "mb-4 font-semibold text-foreground", children: "Information" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("ul", { className: "space-y-2 text-muted-foreground", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("About"),
                className: "transition-colors hover:text-primary",
                children: "About"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("methodology"),
                className: "transition-colors hover:text-primary",
                children: "Methodology"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("blog"),
                className: "transition-colors hover:text-primary",
                children: "Blog"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("resources"),
                className: "transition-colors hover:text-primary",
                children: "Resources"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("uk-government-budget"),
                className: "transition-colors hover:text-primary",
                children: "UK Budget Analysis"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("job-salaries"),
                className: "transition-colors hover:text-primary",
                children: "Job Salaries"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("cost-of-living"),
                className: "transition-colors hover:text-primary",
                children: "Cost of Living"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("uk-financial-stats"),
                className: "transition-colors hover:text-primary",
                children: "Financial Stats"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("contact"),
                className: "transition-colors hover:text-primary",
                children: "Contact Us"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("sitemap"),
                className: "transition-colors hover:text-primary",
                children: "Sitemap"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("link-to-us"),
                className: "transition-colors hover:text-primary",
                children: "Link to Us"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h4", { className: "mb-4 font-semibold text-foreground", children: "Legal" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("ul", { className: "space-y-2 text-muted-foreground", children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("privacy-policy"),
                className: "transition-colors hover:text-primary",
                children: "Privacy Policy"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("cookie-policy"),
                className: "transition-colors hover:text-primary",
                children: "Cookie Policy"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("terms-of-service"),
                className: "transition-colors hover:text-primary",
                children: "Terms of Service"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              Link,
              {
                to: createPageUrl("disclaimer"),
                className: "transition-colors hover:text-primary",
                children: "Disclaimer"
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { children: "\xA9 2025 Calculate My Money - UK Financial Calculator Tools" }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CookieConsentBanner, {})
  ] }) });
}

// src/pages/NotFound.jsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
function NotFound() {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-blue-600 mb-4", children: "404" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900 dark:text-gray-100 mb-2", children: "Page Not Found" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md", children: "Sorry, the page you are looking for doesn\u2019t exist or has been moved." }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      Link,
      {
        to: "/",
        className: "px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition",
        children: "Go back home"
      }
    )
  ] });
}

// src/pages/Home.jsx
var import_react6 = __toESM(require_react(), 1);

// src/components/ui/badge.jsx
var React12 = __toESM(require_react(), 1);
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
var badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/utils/prefetchPage.js
var modules = import.meta.glob("/src/pages/*.jsx");
var prefetchPage = (pageName) => {
  const key = `/src/pages/${pageName}.jsx`;
  const loader = modules[key];
  if (loader) loader();
};

// src/pages/Home.jsx
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var homepageFaqs = [
  {
    question: "How accurate are your UK salary/tax calculators?",
    answer: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { children: "Our calculators are designed to be highly accurate, based on the latest UK tax laws and financial regulations. They use up-to-date information for Income Tax, National Insurance, pension contributions, and student loans for the specified tax year (2025/26)." }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "mt-2", children: "While we strive for precision, these tools are for estimation purposes and should not be considered financial advice. Always consult with a qualified financial advisor for personal financial decisions." })
    ] })
  },
  {
    question: "Which tax year do the calculators use (2025/26)?",
    answer: "All relevant calculators, including the Salary, Income Tax, and National Insurance calculators, have been updated and are based on the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates and thresholds for England, Scotland, Wales, and Northern Ireland are applied where applicable."
  },
  {
    question: "Can I download or print the results?",
    answer: "Yes. Most of our calculators feature 'Export' or 'Print' buttons that allow you to either download your results as a CSV/PDF file or generate a printer-friendly version of the summary. This makes it easy to save your calculations for your records or share them with others."
  }
];
function Home() {
  const location = useLocation();
  const { search, hash } = location;
  const hasQuery = new URLSearchParams(search).has("q");
  const [searchQuery, setSearchQuery] = (0, import_react6.useState)("");
  const [searchResults, setSearchResults] = (0, import_react6.useState)([]);
  const [showAllCalculators, setShowAllCalculators] = (0, import_react6.useState)(false);
  const [pendingScrollSlug, setPendingScrollSlug] = (0, import_react6.useState)(null);
  const lastHandledHashRef = (0, import_react6.useRef)(null);
  const { setSeo, resetSeo } = useSeo();
  const stats = getCalculatorStats();
  const featuredSlugs = [
    "salary-calculator-uk",
    "mortgage-calculator",
    "budget-calculator",
    "income-tax-calculator",
    "compound-interest-calculator",
    "pension-calculator"
  ];
  const featuredCalcObjects = (() => {
    const picks = featuredSlugs.map((slug) => allCalculators.find((c) => c.url === `/${slug}` && c.status === "active")).filter(Boolean);
    return picks.length ? picks : allCalculators.filter((c) => c.status === "active").slice(0, 6);
  })();
  (0, import_react6.useEffect)(() => {
    if (searchQuery.trim()) {
      const results = searchCalculators(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const hubCards = [
    {
      title: "Salary & Income",
      icon: HandCoins,
      link: "#income-employment",
      description: "Calculate take-home pay, tax, and more."
    },
    {
      title: "Tax Calculators",
      icon: PoundSterling,
      link: "#tax-calculators",
      description: "Tools for income tax, NI, VAT, and CGT."
    },
    {
      title: "Mortgage & Loans",
      icon: House,
      link: "#property-mortgages",
      description: "Estimate repayments and affordability."
    },
    {
      title: "Savings & Finance",
      icon: PiggyBank,
      link: "#savings-investments",
      description: "Plan investments and savings goals."
    }
  ];
  (0, import_react6.useEffect)(() => {
    if (!hasQuery) {
      resetSeo();
      return;
    }
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://www.calcmymoney.co.uk";
    const canonical3 = origin.endsWith("/") ? origin : `${origin}/`;
    setSeo({
      robots: "noindex,follow",
      canonical: canonical3
    });
    return () => {
      resetSeo();
    };
  }, [hasQuery, setSeo, resetSeo]);
  (0, import_react6.useEffect)(() => {
    if (!showAllCalculators || !pendingScrollSlug) {
      return;
    }
    if (typeof document === "undefined") {
      return;
    }
    const target = document.getElementById(pendingScrollSlug);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setPendingScrollSlug(null);
  }, [showAllCalculators, pendingScrollSlug]);
  (0, import_react6.useEffect)(() => {
    if (!hash) {
      lastHandledHashRef.current = null;
      return;
    }
    const slug = hash.replace(/^#/, "").trim();
    if (!slug) {
      return;
    }
    if (lastHandledHashRef.current === slug) {
      return;
    }
    lastHandledHashRef.current = slug;
    setShowAllCalculators(true);
    setPendingScrollSlug(slug);
  }, [hash]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "bg-background text-foreground", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "relative border-b border-border/70 bg-hero-surface", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "text-center max-w-4xl mx-auto text-hero-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "title-hero text-hero-foreground mb-4", children: "Free UK Salary, Tax & Mortgage Calculators" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "lead text-muted-foreground mb-8", children: "Use our fast, accurate UK calculators to estimate take-home pay, tax & NI, mortgage repayments, and savings growth for the 2025/26 tax year. Start with salary, tax, mortgage or finance tools below." }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "max-w-3xl mx-auto mb-10", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "relative w-full sm:max-w-xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          Input,
          {
            type: "text",
            placeholder: "Search calculators... (e.g. salary, mortgage, tax)",
            value: searchQuery,
            onChange: handleSearchChange,
            className: "pl-12 pr-4 py-4 text-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 rounded-xl"
          }
        ),
        searchResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute z-50 w-full mt-2 rounded-lg border border-border bg-card shadow-lg", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "p-2 max-h-64 overflow-y-auto text-left", children: searchResults.slice(0, 8).map((calc, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          Link,
          {
            to: calc.url,
            className: "block rounded-lg p-3 transition-colors hover:bg-muted",
            onClick: () => {
              setSearchQuery("");
              setSearchResults([]);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "font-medium text-foreground", children: calc.name }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "body text-muted-foreground", children: calc.description }),
                (calc.category || calc.subCategory) && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("p", { className: "caption text-neutral-soft-foreground", children: [
                  calc.category || "Calculator",
                  " ",
                  calc.subCategory ? `\u2192 ${calc.subCategory}` : ""
                ] })
              ] }),
              calc.status === "planned" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Badge, { variant: "secondary", className: "caption", children: "Coming Soon" }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(ExternalLink, { className: "h-4 w-4 text-muted-foreground/60" })
            ] })
          },
          index
        )) }) })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex flex-wrap items-center justify-center gap-4 body text-muted-foreground sm:gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Calculator, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
            stats.total,
            " Calculators"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
            stats.active,
            " Active"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Users, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: "Free to Use" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "relative z-10 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: hubCards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      "button",
      {
        type: "button",
        onClick: (event) => {
          event.preventDefault();
          const slug = card.link.startsWith("#") ? card.link.slice(1) : card.link;
          setPendingScrollSlug(slug);
          setShowAllCalculators(true);
        },
        className: "group block w-full transform rounded-lg border border-card-muted bg-card p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-4 mb-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "rounded-full bg-pill p-3 text-pill-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(card.icon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              Heading_default,
              {
                as: "h3",
                size: "h3",
                className: "text-foreground transition-colors group-hover:text-primary",
                children: card.title
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "body text-muted-foreground", children: card.description })
        ]
      },
      index
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          Heading_default,
          {
            as: "h2",
            size: "h2",
            weight: "bold",
            className: "mb-4 flex items-center justify-center gap-3 text-foreground",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Calculator, { className: "h-9 w-9 text-primary" }),
              "Popular Calculators"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "lead text-muted-foreground", children: "The most used financial calculators on our platform" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12", children: featuredCalcObjects.map((calc, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        Link,
        {
          to: calc.url,
          onMouseEnter: () => calc.page && prefetchPage(calc.page),
          onFocus: () => calc.page && prefetchPage(calc.page),
          className: "group block rounded-lg border border-card-muted bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(calc.icon, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                Heading_default,
                {
                  as: "h3",
                  size: "h3",
                  className: "text-foreground transition-colors group-hover:text-primary",
                  children: calc.name
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "mb-2 body text-muted-foreground", children: calc.description }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "caption text-neutral-soft-foreground", children: calc.category })
          ]
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "bg-background py-16", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", underline: true, className: "text-foreground text-center mb-10", children: "Common Questions" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FAQSection, { faqs: homepageFaqs })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "bg-neutral-soft py-16", id: "calculator-directory", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-12 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", underline: true, className: "text-foreground mb-4", children: "Complete Calculator Directory" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("p", { className: "mb-6 lead text-muted-foreground", children: [
          "Browse all ",
          stats.total,
          " financial calculators organized by category"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          "button",
          {
            onClick: () => setShowAllCalculators(!showAllCalculators),
            className: "font-medium text-primary transition-colors hover:text-primary/80",
            children: [
              showAllCalculators ? "Hide" : "Show",
              " All Calculators"
            ]
          }
        )
      ] }),
      showAllCalculators ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "space-y-12", children: calculatorCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { id: category.slug, className: "scroll-mt-20", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "mb-6 flex items-center gap-4 border-b-2 border-card-muted pb-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(category.icon, { className: "h-8 w-8 text-primary" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Heading_default, { as: "h3", size: "h3", weight: "bold", className: "text-foreground", children: category.name }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "body text-muted-foreground", children: category.description })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: category.subCategories.map((subCategory) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            Heading_default,
            {
              as: "h4",
              size: "h3",
              className: "border-l-4 border-primary pl-3 text-foreground",
              children: subCategory.name
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "space-y-2 pl-3", children: subCategory.calculators.filter((calc) => showAllCalculators || calc.status === "active").map((calc, index) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-center justify-between group", children: [
            calc.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              Link,
              {
                to: calc.url,
                onMouseEnter: () => calc.page && prefetchPage(calc.page),
                onFocus: () => calc.page && prefetchPage(calc.page),
                className: "flex-1 body font-medium text-primary transition-colors hover:text-primary/80 hover:underline",
                children: calc.name
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "flex-1 body text-muted-foreground/60", children: calc.name }),
            (calc.status === "planned" || calc.status === "pending") && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Badge, { variant: "outline", className: "ml-2 caption text-primary", children: "Coming Soon" })
          ] }, index)) })
        ] }, subCategory.name)) })
      ] }, category.slug)) }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "text-center text-muted-foreground", children: "Expand the directory to explore every calculator we offer." })
    ] }) })
  ] });
}

// src/pages/PrivacyPolicy.jsx
var import_react7 = __toESM(require_react(), 1);
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
function PrivacyPolicy() {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "bg-white py-12", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(ShieldCheck, { className: "w-12 h-12 mx-auto text-blue-600" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mt-4", children: "Privacy Policy" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-lg text-gray-600 mt-2", children: "Last updated: 27/08/2025" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(CardContent, { className: "p-8 space-y-6 text-gray-700 leading-relaxed", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "Welcome to CalcMyMoney.co.uk. We are committed to protecting and respecting your privacy. This policy explains what personal data we collect from you, or that you provide to us, and how it will be processed by us." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "1. Information We Collect" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "We may collect and process the following data about you:" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("ul", { className: "list-disc list-inside space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("strong", { children: "Data You Provide:" }),
          " Information that you provide by filling in forms on our site. This includes data entered into our calculators and information provided when you contact us."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("strong", { children: "Usage Data:" }),
          " We may collect anonymous information about your computer, including your IP address, operating system, and browser type, for system administration and to report aggregate information. This is statistical data about our users' browsing actions and patterns, and does not identify any individual."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "2. Use of Calculator Data" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "All data entered into our financial calculators is processed in your browser. We do not store, save, or view any of the personal or financial data you enter into the calculators on our servers. Your financial information is yours alone." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "3. Cookies" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use and the purposes for which we use them see our Cookie Policy." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "4. Your Rights" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "You have the right to ask us not to process your personal data for marketing purposes. You can exercise your right to prevent such processing by checking certain boxes on the forms we use to collect your data." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "5. Changes to Our Privacy Policy" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by e-mail." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "6. Contact" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "Questions, comments and requests regarding this privacy policy are welcomed and should be addressed through our contact form." })
    ] }) })
  ] }) });
}

// src/pages/CookiePolicy.jsx
var import_react8 = __toESM(require_react(), 1);
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
function CookiePolicy() {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "bg-white py-12", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Cookie, { className: "w-12 h-12 mx-auto text-blue-600" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mt-4", children: "Cookie Policy" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-lg text-gray-600 mt-2", children: "Last updated: 27/08/2025" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(CardContent, { className: "p-8 space-y-6 text-gray-700 leading-relaxed", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800", children: "What are cookies?" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { children: "A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive." }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "How we use cookies" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { children: "Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience and improve our site. We use the following cookies:" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("ul", { className: "list-disc list-inside space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("strong", { children: "Strictly necessary cookies:" }),
          " These are required for the operation of our website."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("strong", { children: "Analytical/performance cookies:" }),
          " They allow us to recognise and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("strong", { children: "Functionality cookies:" }),
          " These are used to recognise you when you return to our website."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 pt-4", children: "Managing Cookies" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { children: "You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site." })
    ] }) })
  ] }) });
}

// src/pages/Contact.jsx
var import_react9 = __toESM(require_react(), 1);

// src/components/ui/textarea.jsx
var React16 = __toESM(require_react(), 1);
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var Textarea = React16.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

// src/pages/Contact.jsx
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var contactFaqs = [
  {
    question: "When will I receive a reply?",
    answer: "We typically respond within 1\u20132 business days. During peak periods (e.g., major UK Budget changes), replies may take a little longer, but we read every message."
  },
  {
    question: "Can you give personal financial advice?",
    answer: "No. We provide educational tools only and cannot offer personalised financial advice. For advice specific to your situation, please speak to a qualified adviser."
  },
  {
    question: "How do you use my contact details?",
    answer: "We use your details solely to respond to your enquiry. See our Privacy Policy for full details on data handling and your rights."
  }
];
function Contact() {
  const [name, setName] = (0, import_react9.useState)("");
  const [email, setEmail] = (0, import_react9.useState)("");
  const [message, setMessage] = (0, import_react9.useState)("");
  const [status, setStatus] = (0, import_react9.useState)("idle");
  const [feedbackMessage, setFeedbackMessage] = (0, import_react9.useState)("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const formspreeEndpoint = "https://formspree.io/f/xwpnppaz";
    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });
      if (response.ok) {
        setStatus("success");
        setFeedbackMessage("Thank you for your message! We'll get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus("error");
      setFeedbackMessage("Sorry, there was an error sending your message. Please try again later.");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "bg-white dark:bg-gray-900 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Send, { className: "w-12 h-12 mx-auto text-blue-600" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mt-4", children: "Contact Us" }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 mt-2", children: "Have a question, feedback, or a suggestion? We'd love to hear from you." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Card, { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(CardContent, { className: "p-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Label, { htmlFor: "name", className: "text-gray-800 dark:text-gray-200", children: "Full Name" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Input,
            {
              id: "name",
              value: name,
              onChange: (e) => setName(e.target.value),
              required: true,
              placeholder: "John Doe",
              className: "dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Label, { htmlFor: "email", className: "text-gray-800 dark:text-gray-200", children: "Email Address" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Input,
            {
              id: "email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              placeholder: "you@example.com",
              className: "dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Label, { htmlFor: "message", className: "text-gray-800 dark:text-gray-200", children: "Message" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            Textarea,
            {
              id: "message",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              required: true,
              placeholder: "Your message here...",
              className: "h-32 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Button, { type: "submit", className: "w-full", disabled: status === "sending", children: [
          status === "sending" && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
          status === "sending" ? "Sending..." : "Send Message"
        ] }) })
      ] }),
      status === "success" && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(CircleCheckBig, { className: "w-5 h-5" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { children: feedbackMessage })
      ] }),
      status === "error" && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "mt-4 p-4 bg-red-100 text-red-800 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { children: feedbackMessage }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "mt-12 space-y-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("section", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900 dark:text-gray-100", children: "Before you get in touch" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-gray-700 dark:text-gray-300 mt-2", children: "Many common questions are answered within our calculator pages and resources. If you\u2019re writing about a specific result, please include the calculator name, your inputs, and the tax year where relevant (e.g., 2025/26)." }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("ul", { className: "list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("li", { children: "Bug report: tell us which page and the exact steps to reproduce the issue." }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("li", { children: "Feature request: describe the use\u2011case and the data you\u2019d like to see." }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("li", { children: "Press/partnerships: include your organisation, timelines, and the calculators of interest." })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("section", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900 dark:text-gray-100", children: "Our typical response" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-gray-700 dark:text-gray-300 mt-2", children: "We aim to reply within 1\u20132 business days. If your question relates to a specific calculation, providing a screenshot and the URL helps us respond faster. For urgent media enquiries, please mention \u201CMedia\u201D in the subject line." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(FAQSection, { faqs: contactFaqs, title: "Contact FAQs" })
    ] })
  ] }) });
}

// src/pages/Resources.jsx
var import_react10 = __toESM(require_react(), 1);
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var governmentResources = [
  {
    title: "HMRC",
    description: "The official source for all UK tax and National Insurance information, rates, and personal tax accounts.",
    url: "https://www.gov.uk/government/organisations/hm-revenue-customs",
    icon: Landmark
  },
  {
    title: "MoneyHelper",
    description: "Free, impartial help with money and pensions, backed by the UK government.",
    url: "https://www.moneyhelper.org.uk/en",
    // Fixed URL
    icon: Banknote
  },
  {
    title: "Citizens Advice",
    description: "Offers confidential advice online, over the phone, and in person, for free.",
    url: "https://www.citizensadvice.org.uk/",
    icon: Landmark
  }
];
var bookReviews = [
  {
    title: "The Psychology of Money by Morgan Housel",
    description: "A brilliant book that explores the strange ways people think about money and teaches you how to make better sense of one of life's most important topics. A must-read for understanding financial behaviour.",
    url: "https://www.amazon.co.uk/Psychology-Money-Morgan-Housel/dp/0857197681",
    icon: Book
  },
  {
    title: "I Will Teach You To Be Rich by Ramit Sethi",
    description: "A practical, no-nonsense 6-week programme for mastering your money. Focuses on automation, conscious spending, and investing for the long term. Highly actionable advice.",
    url: "https://www.amazon.co.uk/Will-Teach-You-Be-Rich/dp/1523505745",
    icon: Book
  },
  {
    title: "Smarter Investing by Tim Hale",
    description: "Considered one of the best books on passive investing for a UK audience. Hale breaks down complex topics into simple, evidence-based principles for building a successful portfolio.",
    url: "https://www.amazon.co.uk/Smarter-Investing-Simpler-Decisions-Financial/dp/0273785370",
    icon: Book
  }
];
function Resources() {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "bg-white py-12", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Book, { className: "w-12 h-12 mx-auto text-blue-600" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mt-4", children: "Financial Resources" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-lg text-gray-600 mt-2 max-w-3xl mx-auto", children: "Knowledge is power. Here are some trusted resources and recommended reading to help you on your financial journey." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "space-y-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 mb-6", children: "Official Guidance & Charities" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: governmentResources.map((resource) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          "a",
          {
            href: resource.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block group",
            children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(Card, { className: "h-full transition-all duration-300 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(CardHeader, { className: "flex flex-row items-center gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(resource.icon, { className: "w-8 h-8 text-gray-500" }),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CardTitle, { children: resource.title })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-gray-600", children: resource.description }) })
            ] })
          },
          resource.title
        )) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 mb-6", children: "Recommended Reading" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: bookReviews.map((book) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          "a",
          {
            href: book.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block group",
            children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(Card, { className: "h-full transition-all duration-300 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(CardHeader, { className: "flex flex-row items-center gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(book.icon, { className: "w-8 h-8 text-gray-500" }),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CardTitle, { children: book.title })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-gray-600", children: book.description }) })
            ] })
          },
          book.title
        )) })
      ] })
    ] })
  ] }) });
}

// src/pages/Blog.jsx
var import_react11 = __toESM(require_react(), 1);
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var blogPosts = [
  {
    title: "The Math Behind a Good Life: Why Small Money Calculations Change Big Outcomes",
    excerpt: "Why tiny calculations\u2014salary, tax, mortgage, budgeting\u2014create calmer, more confident decisions. A practical blueprint for UK households.",
    date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),
    author: "CalcMyMoney Team",
    category: "Mindset",
    readTime: "7 min read",
    url: "/blog/why-small-calculations-matter",
    image: {
      baseUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    }
  },
  {
    title: "Smart Money-Saving Tips for UK Families: Tackling Groceries & Energy Bills",
    excerpt: "A guide to cutting costs on two of the biggest drains on family finances \u2013 groceries and energy bills.",
    date: "October 26, 2023",
    author: "CalcMyMoney Team",
    category: "Money Saving",
    readTime: "7 min read",
    url: createPageUrl("BlogSmartMoneySavingTips"),
    image: {
      baseUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    }
  },
  {
    title: "Debt Snowball vs. Debt Avalanche: Which UK Debt Repayment Strategy is Right for You?",
    excerpt: "The two most popular debt repayment strategies explained, helping you choose the right path to a debt-free life in the UK.",
    date: "October 24, 2023",
    author: "CalcMyMoney Team",
    category: "Debt Management",
    readTime: "6 min read",
    url: createPageUrl("BlogDebtRepaymentStrategies"),
    image: {
      baseUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    }
  },
  {
    title: "My Relationship with Money: A Guide to Financial Psychology",
    excerpt: "Understand the 'why' behind your financial decisions. Explore your money mindset and learn how to build a healthier, more prosperous future.",
    date: "October 22, 2023",
    author: "CalcMyMoney Team",
    category: "Mindset",
    readTime: "8 min read",
    url: createPageUrl("BlogFinancialPsychology"),
    image: {
      baseUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    }
  }
];
var categoryColors = {
  "Money Saving": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "Debt Management": "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  Mindset: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  "Tax Updates": "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  Budgeting: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
};
function Blog() {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "bg-neutral-soft py-12", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", underline: true, className: "mb-6 text-foreground", children: "Financial Insights & Updates" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "lead text-muted-foreground max-w-3xl mx-auto", children: "Stay informed with the latest UK financial news, tax updates, and money management strategies." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: blogPosts.map((post, index) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      Link,
      {
        to: post.url,
        className: `group ${post.url === "#" ? "pointer-events-none" : ""}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Card, { className: "flex h-full flex-col transition-shadow duration-300 hover:shadow-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "img",
            {
              src: `${post.image.baseUrl}?${post.image.params}&w=${post.image.width}`,
              srcSet: post.image.srcSetWidths.map((width) => `${post.image.baseUrl}?${post.image.params}&w=${width} ${width}w`).join(", "),
              sizes: post.image.sizes,
              alt: post.title,
              width: post.image.width,
              height: post.image.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-48 object-cover rounded-t-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(CardHeader, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mb-2 flex items-center justify-between text-sm text-muted-foreground", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs font-medium ${categoryColors[post.category] || "bg-gray-100 text-gray-800"}`,
                  children: post.category
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Clock, { className: "w-4 h-4" }),
                post.readTime
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(CardTitle, { className: "heading-3 transition-colors group-hover:text-primary", children: post.title })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(CardContent, { className: "flex-grow flex flex-col", children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "mb-4 flex-grow leading-relaxed text-muted-foreground", children: post.excerpt }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mt-auto flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(User, { className: "w-4 h-4" }),
                post.author
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex items-center gap-1 group-hover:gap-2 transition-all", children: [
                "Read More ",
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ArrowRight, { className: "w-4 h-4 transition-transform" })
              ] })
            ] })
          ] })
        ] })
      },
      index
    )) })
  ] }) });
}

// src/pages/Sitemap.jsx
var import_react12 = __toESM(require_react(), 1);

// src/components/data/seo-data.jsx
var jobTitles = [
  // Tech & IT
  {
    title: "Software Developer",
    category: "Technology",
    averageSalary: 45e3,
    description: "Design, develop and maintain software applications and systems."
  },
  {
    title: "Data Scientist",
    category: "Technology",
    averageSalary: 55e3,
    description: "Analyze complex data to help organizations make better decisions."
  },
  {
    title: "Cybersecurity Analyst",
    category: "Technology",
    averageSalary: 5e4,
    description: "Protect organizations from cyber threats and security breaches."
  },
  {
    title: "Product Manager",
    category: "Technology",
    averageSalary: 6e4,
    description: "Guide product development from conception to launch."
  },
  {
    title: "UX Designer",
    category: "Technology",
    averageSalary: 42e3,
    description: "Design user interfaces and experiences for digital products."
  },
  {
    title: "DevOps Engineer",
    category: "Technology",
    averageSalary: 52e3,
    description: "Bridge development and operations to streamline software delivery."
  },
  // Healthcare
  {
    title: "Registered Nurse",
    category: "Healthcare",
    averageSalary: 35e3,
    description: "Provide patient care and support in various healthcare settings."
  },
  {
    title: "General Practitioner",
    category: "Healthcare",
    averageSalary: 85e3,
    description: "Diagnose and treat patients in primary care settings."
  },
  {
    title: "Pharmacist",
    category: "Healthcare",
    averageSalary: 45e3,
    description: "Dispense medications and provide pharmaceutical expertise."
  },
  {
    title: "Physiotherapist",
    category: "Healthcare",
    averageSalary: 38e3,
    description: "Help patients recover mobility and manage pain through physical therapy."
  },
  // Finance
  {
    title: "Financial Analyst",
    category: "Finance",
    averageSalary: 42e3,
    description: "Analyze financial data to support business decisions."
  },
  {
    title: "Accountant",
    category: "Finance",
    averageSalary: 35e3,
    description: "Manage financial records and ensure compliance with regulations."
  },
  {
    title: "Investment Banker",
    category: "Finance",
    averageSalary: 75e3,
    description: "Provide financial advisory services for corporate transactions."
  },
  {
    title: "Tax Advisor",
    category: "Finance",
    averageSalary: 4e4,
    description: "Provide tax planning and compliance advice to individuals and businesses."
  },
  // Education
  {
    title: "Primary School Teacher",
    category: "Education",
    averageSalary: 3e4,
    description: "Educate and nurture children in primary education settings."
  },
  {
    title: "Secondary School Teacher",
    category: "Education",
    averageSalary: 32e3,
    description: "Teach specialized subjects to secondary school students."
  },
  {
    title: "University Lecturer",
    category: "Education",
    averageSalary: 45e3,
    description: "Deliver higher education courses and conduct research."
  },
  // Engineering
  {
    title: "Civil Engineer",
    category: "Engineering",
    averageSalary: 42e3,
    description: "Design and oversee construction of infrastructure projects."
  },
  {
    title: "Mechanical Engineer",
    category: "Engineering",
    averageSalary: 4e4,
    description: "Design and develop mechanical systems and devices."
  },
  {
    title: "Electrical Engineer",
    category: "Engineering",
    averageSalary: 43e3,
    description: "Design electrical systems and equipment."
  },
  // Legal
  {
    title: "Solicitor",
    category: "Legal",
    averageSalary: 55e3,
    description: "Provide legal advice and represent clients in legal matters."
  },
  {
    title: "Barrister",
    category: "Legal",
    averageSalary: 65e3,
    description: "Represent clients in court and provide specialist legal advice."
  },
  {
    title: "Legal Secretary",
    category: "Legal",
    averageSalary: 28e3,
    description: "Provide administrative support in legal environments."
  },
  // Marketing & Sales
  {
    title: "Marketing Manager",
    category: "Marketing",
    averageSalary: 45e3,
    description: "Develop and execute marketing strategies to promote products or services."
  },
  {
    title: "Sales Representative",
    category: "Sales",
    averageSalary: 35e3,
    description: "Sell products or services to customers and clients."
  },
  {
    title: "Digital Marketing Specialist",
    category: "Marketing",
    averageSalary: 38e3,
    description: "Manage online marketing campaigns and digital presence."
  },
  // Other Popular Roles
  {
    title: "Project Manager",
    category: "Management",
    averageSalary: 48e3,
    description: "Plan, execute and oversee projects from start to finish."
  },
  {
    title: "HR Manager",
    category: "Human Resources",
    averageSalary: 42e3,
    description: "Oversee human resources functions and employee relations."
  },
  {
    title: "Chef",
    category: "Hospitality",
    averageSalary: 28e3,
    description: "Prepare and cook food in restaurants and other establishments."
  },
  {
    title: "Graphic Designer",
    category: "Creative",
    averageSalary: 32e3,
    description: "Create visual concepts and designs for various media."
  },
  {
    title: "Police Officer",
    category: "Public Service",
    averageSalary: 33e3,
    description: "Maintain public order and safety, investigate crimes."
  },
  {
    title: "Social Worker",
    category: "Social Services",
    averageSalary: 32e3,
    description: "Support individuals and families facing various challenges."
  }
];
var ukCities = [
  {
    name: "London",
    region: "Greater London",
    population: "9,000,000",
    rentIndex: 100,
    description: "The UK's capital and largest city, known for its financial district and cultural attractions."
  },
  {
    name: "Manchester",
    region: "Greater Manchester",
    population: "547,000",
    rentIndex: 65,
    description: "A major city in northwest England, known for its industrial heritage and vibrant music scene."
  },
  {
    name: "Birmingham",
    region: "West Midlands",
    population: "1,100,000",
    rentIndex: 60,
    description: "The UK's second-largest city, located in the West Midlands."
  },
  {
    name: "Leeds",
    region: "West Yorkshire",
    population: "793,000",
    rentIndex: 58,
    description: "A major city in West Yorkshire, known for its business and financial sectors."
  },
  {
    name: "Glasgow",
    region: "Scotland",
    population: "635,000",
    rentIndex: 55,
    description: "Scotland's largest city, known for its Victorian architecture and cultural scene."
  },
  {
    name: "Liverpool",
    region: "Merseyside",
    population: "498,000",
    rentIndex: 52,
    description: "A major port city in northwest England, famous for The Beatles and maritime history."
  },
  {
    name: "Bristol",
    region: "South West England",
    population: "463,000",
    rentIndex: 70,
    description: "A city in southwest England, known for its harbourside and creative industries."
  },
  {
    name: "Edinburgh",
    region: "Scotland",
    population: "518,000",
    rentIndex: 68,
    description: "Scotland's capital city, known for its historic Old Town and annual festivals."
  },
  {
    name: "Sheffield",
    region: "South Yorkshire",
    population: "584,000",
    rentIndex: 48,
    description: "A city in South Yorkshire, known for its steel industry heritage."
  },
  {
    name: "Newcastle",
    region: "North East England",
    population: "300,000",
    rentIndex: 50,
    description: "A city in northeast England, known for its nightlife and Geordie culture."
  },
  {
    name: "Nottingham",
    region: "East Midlands",
    population: "332,000",
    rentIndex: 55,
    description: "A city in the East Midlands, famous for its association with Robin Hood."
  },
  {
    name: "Brighton",
    region: "South East England",
    population: "290,000",
    rentIndex: 75,
    description: "A seaside city on England's south coast, known for its pier and vibrant arts scene."
  },
  {
    name: "Cardiff",
    region: "Wales",
    population: "366,000",
    rentIndex: 58,
    description: "The capital of Wales, known for its castle and regenerated waterfront."
  },
  {
    name: "Oxford",
    region: "South East England",
    population: "155,000",
    rentIndex: 80,
    description: "Home to the famous University of Oxford and known as the 'City of Dreaming Spires'."
  },
  {
    name: "Cambridge",
    region: "East of England",
    population: "124,000",
    rentIndex: 82,
    description: "Home to the University of Cambridge and a hub for technology companies."
  }
];
var createSlug = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
};

// src/pages/Sitemap.jsx
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var staticPages = [
  { url: createPageUrl("Home"), title: "Home" },
  { url: createPageUrl("Resources"), title: "Resources" },
  { url: createPageUrl("Blog"), title: "Blog" },
  { url: createPageUrl("Contact"), title: "Contact" },
  { url: createPageUrl("JobSalaries"), title: "Job Salaries" },
  { url: createPageUrl("CostOfLiving"), title: "Cost of Living" },
  { url: createPageUrl("UKGovernmentBudget"), title: "UK Budget Analysis" },
  { url: createPageUrl("UKFinancialStats"), title: "UK Financial Statistics" },
  // Added Hub + Child Salary pages
  { url: createPageUrl("SalaryCalculatorUK"), title: "Salary Calculator (Hub)" },
  { url: createPageUrl("SalaryCalculatorTakeHomePay"), title: "Take-Home Pay Calculator" },
  { url: createPageUrl("SalaryCalculatorPaycheck"), title: "Paycheck Calculator" },
  { url: createPageUrl("GrossToNetCalculator"), title: "Gross to Net Calculator" },
  { url: createPageUrl("ProRataSalaryCalculator"), title: "Pro-Rata Salary Calculator" }
];
var legalPages = [
  { url: createPageUrl("PrivacyPolicy"), title: "Privacy Policy" },
  { url: createPageUrl("CookiePolicy"), title: "Cookie Policy" },
  { url: createPageUrl("TermsOfService"), title: "Terms of Service" },
  { url: createPageUrl("Disclaimer"), title: "Disclaimer" }
];
var blogPosts2 = [
  {
    url: createPageUrl("BlogSmartMoneySavingTips"),
    title: "Smart Money-Saving Tips for Everyday Life"
  },
  {
    url: createPageUrl("BlogDebtRepaymentStrategies"),
    title: "Effective Debt Repayment Strategies"
  },
  { url: createPageUrl("BlogFinancialPsychology"), title: "The Psychology of Money" },
  { url: "/blog/why-small-calculations-matter", title: "Why Small Money Calculations Matter" }
];
var SitemapSection = ({ title: title2, links, columns = 1 }) => /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "mb-8", children: [
  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 border-b-2 border-gray-200 pb-2 mb-4", children: title2 }),
  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("ul", { className: `space-y-2 list-disc list-inside columns-${columns}`, children: links.map((link, index) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("li", { className: "break-inside-avoid", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Link, { to: link.url, className: "text-blue-600 hover:underline", children: link.title }) }, index)) })
] });
function Sitemap() {
  const calculatorLinks = calculatorCategories.flatMap(
    (category) => category.subCategories.flatMap(
      (sub) => sub.calculators.filter((calc) => calc.status === "active").map((calc) => ({
        url: calc.url,
        title: calc.name
      }))
    )
  ).sort((a, b) => a.title.localeCompare(b.title));
  const jobLinks = jobTitles.map((job) => ({
    url: `/job-salaries/${createSlug(job.title)}`,
    title: `${job.title} Salary`
  }));
  const costOfLivingBase = createPageUrl("CostOfLiving");
  const cityLinks = ukCities.map((city) => ({
    url: `${costOfLivingBase}/${createSlug(city.name)}`,
    title: `Cost of Living in ${city.name}`
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Heading_default, { as: "h1", size: "h1", weight: "extrabold", className: "text-gray-900", children: "Sitemap" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "mt-2 text-lg text-gray-600", children: "A complete list of all pages on CalcMyMoney.co.uk" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "lg:col-span-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Main Pages", links: staticPages }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Blog Articles", links: blogPosts2 }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Legal", links: legalPages })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "lg:col-span-2", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Financial Calculators", links: calculatorLinks, columns: 2 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Job Salaries", links: jobLinks, columns: 4 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SitemapSection, { title: "Cost of Living by City", links: cityLinks, columns: 4 }) })
    ] })
  ] }) });
}

// src/pages/JobSalaries.jsx
var import_react13 = __toESM(require_react(), 1);
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
function JobSalaries() {
  const [searchTerm, setSearchTerm] = (0, import_react13.useState)("");
  const categories = [...new Set(jobTitles.map((job) => job.category))];
  const filteredJobs = jobTitles.filter(
    (job) => job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Job Salary Explorer" }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Discover average salaries for hundreds of jobs across the UK. Find out what you could be earning." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "mb-8", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          Input,
          {
            type: "text",
            placeholder: "Search for a job title...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10 text-lg"
          }
        )
      ] }) }),
      searchTerm ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredJobs.length > 0 ? filteredJobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        Link,
        {
          to: `/job-salaries/${createSlug(job.title)}`,
          className: "group",
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Card, { className: "hover:shadow-lg hover:border-blue-300 transition-all", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Briefcase, { className: "w-5 h-5 text-blue-600" }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: job.title })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: job.description }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Badge, { variant: "secondary", children: job.category }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { className: "font-semibold text-lg", children: [
                  "~\xA3",
                  job.averageSalary.toLocaleString(),
                  "/yr"
                ] })
              ] })
            ] })
          ] })
        },
        job.title
      )) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "text-center md:col-span-3 text-gray-500", children: [
        'No job titles found for "',
        searchTerm,
        '".'
      ] }) }) : categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "mb-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "border-b-2 border-blue-500 pb-2 mb-4", children: category }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: jobTitles.filter((job) => job.category === category).map((job) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          Link,
          {
            to: `/job-salaries/${createSlug(job.title)}`,
            className: "group",
            children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg hover:bg-blue-100 transition-colors", children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "font-semibold text-gray-800 group-hover:text-blue-700", children: job.title }),
              /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "text-sm text-gray-600", children: [
                "~\xA3",
                job.averageSalary.toLocaleString()
              ] })
            ] })
          },
          job.title
        )) })
      ] }, category))
    ] })
  ] });
}

// src/pages/CostOfLiving.jsx
var import_react14 = __toESM(require_react(), 1);
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
function CostOfLiving() {
  const regions = [...new Set(ukCities.map((city) => city.region))];
  const costOfLivingBase = createPageUrl("CostOfLiving");
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Cost of Living Explorer" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Compare rental costs, population, and other key stats for major cities across the United Kingdom." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: regions.map((region) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "mb-10", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "border-b-2 border-green-500 pb-2 mb-4", children: region }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: ukCities.filter((city) => city.region === region).map((city) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        Link,
        {
          to: `${costOfLivingBase}/${createSlug(city.name)}`,
          className: "group",
          children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(Card, { className: "hover:shadow-lg hover:border-green-300 transition-all", children: [
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MapPin, { className: "w-5 h-5 text-green-600" }),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: city.name })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(CardContent, { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { className: "text-gray-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Users, { className: "w-4 h-4" }),
                  " Population:"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "font-medium", children: city.population })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { className: "text-gray-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(TrendingUp, { className: "w-4 h-4" }),
                  " Rent Index:"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "font-medium", children: city.rentIndex })
              ] })
            ] })
          ] })
        },
        city.name
      )) })
    ] }, region)) })
  ] });
}

// src/pages/UKGovernmentBudget.jsx
var import_react15 = __toESM(require_react(), 1);
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var governmentBudget2024 = {
  // Data reflecting 2024/25 fiscal year estimates
  revenue: [
    {
      category: "Income Tax",
      amount: 275e3,
      percentage: 26.2,
      icon: Users,
      description: "Tax on individual earnings"
    },
    {
      category: "National Insurance",
      amount: 178e3,
      percentage: 17,
      icon: Shield,
      description: "Contributions for pensions and benefits"
    },
    {
      category: "VAT",
      amount: 17e4,
      percentage: 16.2,
      icon: PoundSterling,
      description: "Value Added Tax on goods and services"
    },
    {
      category: "Corporation Tax",
      amount: 105e3,
      percentage: 10,
      icon: Building,
      description: "Tax on company profits"
    },
    {
      category: "Fuel, Alcohol, Tobacco",
      amount: 48e3,
      percentage: 4.6,
      icon: TrendingUp,
      description: "Duties on fuel, alcohol and tobacco"
    },
    {
      category: "Council Tax",
      amount: 46e3,
      percentage: 4.4,
      icon: Building,
      description: "Local authority property tax"
    },
    {
      category: "Business Rates",
      amount: 33e3,
      percentage: 3.1,
      icon: Building,
      description: "Commercial property tax"
    },
    {
      category: "Other",
      amount: 195e3,
      percentage: 18.5,
      icon: PoundSterling,
      description: "Interest, dividends, other taxes"
    }
  ],
  expenditure: [
    {
      category: "Social Protection",
      amount: 395e3,
      percentage: 34,
      icon: Users,
      description: "State Pension, Universal Credit, other benefits"
    },
    {
      category: "Health (NHS)",
      amount: 24e4,
      percentage: 20.7,
      icon: Heart,
      description: "Healthcare services, staff, and infrastructure"
    },
    {
      category: "Education",
      amount: 125e3,
      percentage: 10.8,
      icon: GraduationCap,
      description: "Schools, universities, and skills training"
    },
    {
      category: "Debt Interest",
      amount: 115e3,
      percentage: 9.9,
      icon: TrendingDown,
      description: "Interest on national government debt"
    },
    {
      category: "Defence",
      amount: 65e3,
      percentage: 5.6,
      icon: Shield,
      description: "Military operations and national security"
    },
    {
      category: "Transport",
      amount: 45e3,
      percentage: 3.9,
      icon: TrendingUp,
      description: "Roads, railways, and public transport"
    },
    {
      category: "Public Order & Safety",
      amount: 4e4,
      percentage: 3.4,
      icon: Shield,
      description: "Police, courts, and prisons"
    },
    {
      category: "Other Spending",
      amount: 135e3,
      percentage: 11.6,
      icon: Building,
      description: "Housing, environment, culture, etc."
    }
  ],
  totalRevenue: 105e4,
  totalExpenditure: 116e4,
  deficit: -11e4
};
var governmentBudget2025 = {
  // Data reflecting 2025/26 fiscal year forecasts
  revenue: [
    {
      category: "Income Tax",
      amount: 29e4,
      percentage: 26.6,
      icon: Users,
      description: "Tax on individual earnings"
    },
    {
      category: "National Insurance",
      amount: 185e3,
      percentage: 17,
      icon: Shield,
      description: "Contributions for pensions and benefits"
    },
    {
      category: "VAT",
      amount: 175e3,
      percentage: 16.1,
      icon: PoundSterling,
      description: "Value Added Tax on goods and services"
    },
    {
      category: "Corporation Tax",
      amount: 11e4,
      percentage: 10.1,
      icon: Building,
      description: "Tax on company profits"
    },
    {
      category: "Fuel, Alcohol, Tobacco",
      amount: 49e3,
      percentage: 4.5,
      icon: TrendingUp,
      description: "Duties on fuel, alcohol and tobacco"
    },
    {
      category: "Council Tax",
      amount: 48e3,
      percentage: 4.4,
      icon: Building,
      description: "Local authority property tax"
    },
    {
      category: "Business Rates",
      amount: 34e3,
      percentage: 3.1,
      icon: Building,
      description: "Commercial property tax"
    },
    {
      category: "Other",
      amount: 199e3,
      percentage: 18.2,
      icon: PoundSterling,
      description: "Interest, dividends, other taxes"
    }
  ],
  expenditure: [
    {
      category: "Social Protection",
      amount: 41e4,
      percentage: 34.8,
      icon: Users,
      description: "State Pension, Universal Credit, other benefits"
    },
    {
      category: "Health (NHS)",
      amount: 25e4,
      percentage: 21.2,
      icon: Heart,
      description: "Healthcare services, staff, and infrastructure"
    },
    {
      category: "Education",
      amount: 13e4,
      percentage: 11,
      icon: GraduationCap,
      description: "Schools, universities, and skills training"
    },
    {
      category: "Debt Interest",
      amount: 105e3,
      percentage: 8.9,
      icon: TrendingDown,
      description: "Interest on national government debt"
    },
    {
      category: "Defence",
      amount: 7e4,
      percentage: 5.9,
      icon: Shield,
      description: "Military operations and national security"
    },
    {
      category: "Transport",
      amount: 48e3,
      percentage: 4.1,
      icon: TrendingUp,
      description: "Roads, railways, and public transport"
    },
    {
      category: "Public Order & Safety",
      amount: 42e3,
      percentage: 3.6,
      icon: Shield,
      description: "Police, courts, and prisons"
    },
    {
      category: "Other Spending",
      amount: 125e3,
      percentage: 10.6,
      icon: Building,
      description: "Housing, environment, culture, etc."
    }
  ],
  totalRevenue: 109e4,
  totalExpenditure: 118e4,
  deficit: -9e4
};
var CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#84cc16"
];
function UKGovernmentBudget() {
  const [selectedYear, setSelectedYear] = (0, import_react15.useState)("2025");
  const currentBudget = selectedYear === "2025" ? governmentBudget2025 : governmentBudget2024;
  const prepareChartData = (data) => {
    return data.map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: data.category }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { style: { color: data.color }, children: [
          "\xA3",
          (data.amount / 1e3).toFixed(1),
          "bn (",
          data.percentage.toFixed(1),
          "%)"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: data.description })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: [
        "UK Government Budget ",
        selectedYear,
        "/",
        (parseInt(selectedYear) + 1).toString().slice(-2),
        " | Where Your Taxes Go"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto", children: "Understand how the UK government manages the nation's finances. See exactly where tax revenue comes from and how every pound of public money is spent." }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "mt-6 text-sm text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { children: [
        "Comprehensive breakdown of UK government income and expenditure \u2022 Financial Year",
        " ",
        selectedYear,
        "/",
        (parseInt(selectedYear) + 1).toString().slice(-2)
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "text-center mb-8", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "inline-flex rounded-lg border border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "button",
          {
            onClick: () => setSelectedYear("2024"),
            className: `px-6 py-2 rounded-l-lg ${selectedYear === "2024" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
            children: "2024/25"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "button",
          {
            onClick: () => setSelectedYear("2025"),
            className: `px-6 py-2 rounded-r-lg border-l border-gray-200 dark:border-gray-700 ${selectedYear === "2025" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`,
            children: "2025/26"
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(CardContent, { className: "p-6 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TrendingUp, { className: "w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm font-medium text-green-800 dark:text-green-300", children: "Total Revenue" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: [
            "\xA3",
            (currentBudget.totalRevenue / 1e3).toFixed(0),
            "bn"
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(CardContent, { className: "p-6 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TrendingDown, { className: "w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm font-medium text-blue-800 dark:text-blue-300", children: "Total Spending" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: [
            "\xA3",
            (currentBudget.totalExpenditure / 1e3).toFixed(0),
            "bn"
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          Card,
          {
            className: `bg-gradient-to-br ${currentBudget.deficit < 0 ? "from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700" : "from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(CardContent, { className: "p-6 text-center", children: [
              currentBudget.deficit < 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TrendingDown, { className: "w-8 h-8 mx-auto text-red-600 dark:text-red-400 mb-2" }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TrendingUp, { className: "w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                "p",
                {
                  className: `text-sm font-medium ${currentBudget.deficit < 0 ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`,
                  children: currentBudget.deficit < 0 ? "Budget Deficit" : "Budget Surplus"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                "p",
                {
                  className: `text-2xl font-bold ${currentBudget.deficit < 0 ? "text-red-900 dark:text-red-100" : "text-green-900 dark:text-green-100"}`,
                  children: [
                    "\xA3",
                    Math.abs(currentBudget.deficit / 1e3).toFixed(0),
                    "bn"
                  ]
                }
              ),
              currentBudget.deficit < 0 && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-xs text-red-700 dark:text-red-300 mt-1", children: "(Financed by government borrowing)" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Tabs, { defaultValue: "revenue", className: "space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TabsTrigger, { value: "revenue", children: "Government Revenue" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TabsTrigger, { value: "expenditure", children: "Government Spending" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TabsContent, { value: "revenue", className: "space-y-8", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardTitle, { children: "Revenue Sources Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(PieChart, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                Pie,
                {
                  data: prepareChartData(currentBudget.revenue),
                  cx: "50%",
                  cy: "50%",
                  outerRadius: 100,
                  dataKey: "amount",
                  label: ({ category, percentage }) => `${category.split(" ")[0]} ${percentage.toFixed(1)}%`,
                  className: "text-xs fill-gray-600 dark:fill-gray-400",
                  children: prepareChartData(currentBudget.revenue).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CustomTooltip, {}) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardTitle, { children: "Revenue Details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardContent, { className: "space-y-3", children: currentBudget.revenue.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
              "div",
              {
                className: "flex items-center justify-between p-3 border-l-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg",
                style: { borderLeftColor: CHART_COLORS[index % CHART_COLORS.length] },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(item.icon, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.category }),
                      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "text-right", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "font-semibold text-gray-900 dark:text-gray-100", children: [
                      "\xA3",
                      (item.amount / 1e3).toFixed(1),
                      "bn"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                      item.percentage.toFixed(1),
                      "%"
                    ] })
                  ] })
                ]
              },
              item.category
            )) })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(TabsContent, { value: "expenditure", className: "space-y-8", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardTitle, { children: "Spending Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(PieChart, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                Pie,
                {
                  data: prepareChartData(currentBudget.expenditure),
                  cx: "50%",
                  cy: "50%",
                  outerRadius: 100,
                  dataKey: "amount",
                  label: ({ category, percentage }) => `${category.includes("(") ? category.split("(")[0].trim() : category.split(" ")[0]} ${percentage.toFixed(1)}%`,
                  className: "text-xs fill-gray-600 dark:fill-gray-400",
                  children: prepareChartData(currentBudget.expenditure).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CustomTooltip, {}) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardTitle, { children: "Spending Details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardContent, { className: "space-y-3", children: currentBudget.expenditure.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
              "div",
              {
                className: "flex items-center justify-between p-3 border-l-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg",
                style: { borderLeftColor: CHART_COLORS[index % CHART_COLORS.length] },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(item.icon, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.category }),
                      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "text-right", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "font-semibold text-gray-900 dark:text-gray-100", children: [
                      "\xA3",
                      (item.amount / 1e3).toFixed(1),
                      "bn"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                      item.percentage.toFixed(1),
                      "%"
                    ] })
                  ] })
                ]
              },
              item.category
            )) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Card, { className: "mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(CardContent, { className: "p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-blue-900 dark:text-blue-100 mb-4", children: "What This Means for Your Personal Budget" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-blue-800 dark:text-blue-200 mb-6", children: "The government's budget management principles apply to personal finances too. Just like the Treasury balances income and expenditure, you should track where your money comes from and where it goes." }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Link, { to: createPageUrl("SalaryCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Button, { className: "bg-blue-600 hover:bg-blue-700", children: "Calculate Your Take-Home Pay" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Link, { to: createPageUrl("BudgetCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Button, { variant: "outline", children: "Plan Your Personal Budget" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Link, { to: createPageUrl("IncomeTaxCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Button, { variant: "outline", children: "See Your Tax Contribution" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Card, { className: "mt-8 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Sources" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "text-sm text-gray-700 dark:text-gray-300 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { children: [
            "\u2022",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "a",
              {
                href: "https://obr.uk/forecasts-in-depth/tax-by-tax-spend-by-spend/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline hover:text-blue-600",
                children: "Office for Budget Responsibility (OBR) - Fiscal Outlook"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { children: [
            "\u2022",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "a",
              {
                href: "https://www.gov.uk/government/organisations/hm-treasury",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline hover:text-blue-600",
                children: "HM Treasury - Public Spending Statistics"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { children: [
            "\u2022",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "a",
              {
                href: "https://www.ons.gov.uk/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline hover:text-blue-600",
                children: "ONS (Office for National Statistics) - Government Finance Statistics"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-4", children: "*Figures are estimates based on official government projections and may be subject to revision. All amounts shown in millions of pounds (\xA3m). A budget deficit is covered by government borrowing (issuing gilts), which adds to the national debt and incurs interest payments, as shown in the expenditure." })
      ] }) })
    ] })
  ] });
}

// src/pages/TermsOfService.jsx
var import_react16 = __toESM(require_react(), 1);
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
function TermsOfService() {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "bg-white dark:bg-gray-900 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(FileText, { className: "w-12 h-12 mx-auto text-blue-600" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mt-4", children: "Terms of Service" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 mt-2", children: "Last updated: 27/08/2025" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Card, { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(CardContent, { className: "p-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "Welcome to CalcMyMoney.co.uk. By accessing or using our website and its services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "1. Use of Calculators and Content" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "The financial calculators, tools, and content provided on CalcMyMoney.co.uk are for informational and educational purposes only. They are intended to be used as a guide and for personal, non-commercial use. The results from the calculators are estimates and should not be considered as professional financial advice." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "2. No Financial Advice" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "CalcMyMoney.co.uk is not a financial advisor. The information provided on this website does not constitute financial, tax, legal, or investment advice. You should consult with a qualified professional before making any financial decisions. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "3. Accuracy of Information" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "We strive to keep the information and calculation logic up-to-date and correct. However, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Tax laws and regulations change frequently." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "4. Limitation of Liability" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "In no event will CalcMyMoney.co.uk, nor its owners, employees, or affiliates, be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "5. Governing Law" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions." }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "6. Changes to Terms" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page." })
    ] }) })
  ] }) });
}

// src/pages/Disclaimer.jsx
var import_react17 = __toESM(require_react(), 1);
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
function Disclaimer() {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "bg-white py-12", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TriangleAlert, { className: "w-12 h-12 mx-auto text-amber-500" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mt-4", children: "Disclaimer" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-lg text-gray-600 mt-2", children: "Last updated: 27/08/2025" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Card, { className: "bg-amber-50 border-amber-200", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(CardContent, { className: "p-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed", children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100", children: "For Informational Purposes Only" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { children: "The information and calculations provided by CalcMyMoney.co.uk are for general informational and educational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or calculation on the site." }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "Not Professional Advice" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { children: "The use of our calculators does not create a professional-client relationship. The website cannot and does not contain financial advice. The financial information is provided for general informational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals." }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "Calculations are Estimates" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { children: "The results generated by our calculators are estimates based on the data you provide and current (as of the date of the last update) tax laws and financial formulas. These figures may not reflect your actual financial situation and should be used as a guide only. We do not guarantee the accuracy of any calculation." }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-800 dark:text-gray-100 pt-4", children: "No Guarantees" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { children: "Your reliance on any information on the site is solely at your own risk. We do not warrant that the site will be available, uninterrupted, or error-free. Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site." })
    ] }) })
  ] }) });
}

// src/pages/BlogSmartMoneySavingTips.jsx
var import_react18 = __toESM(require_react(), 1);
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var createUnsplashUrl = (baseUrl, params, width) => `${baseUrl}?${params}&w=${width}`;
var createUnsplashSrcSet = (baseUrl, params, widths) => widths.map((width) => `${createUnsplashUrl(baseUrl, params, width)} ${width}w`).join(", ");
function BlogSmartMoneySavingTips() {
  const post = (0, import_react18.useMemo)(
    () => ({
      title: "Smart Money-Saving Tips for UK Families: Tackling Groceries & Energy Bills",
      category: "Money Saving",
      readTime: "7 min read",
      author: "CalcMyMoney Team",
      displayDate: "October 26, 2023",
      publishedTime: "2023-10-26T08:00:00+00:00",
      modifiedTime: "2023-10-26T08:00:00+00:00",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "A family happily unpacking groceries in a bright, modern kitchen.",
      tags: ["Money Saving", "Family Budgeting", "Energy Bills", "UK Finance"]
    }),
    []
  );
  const heroImage = (0, import_react18.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1280,
      height: 853,
      srcSetWidths: [480, 768, 1024, 1280],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 896px"
    }),
    []
  );
  const groceriesImage = (0, import_react18.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Fresh vegetables and groceries laid out for meal planning"
    }),
    []
  );
  const thermostatImage = (0, import_react18.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Modern smart thermostat on wall showing energy savings"
    }),
    []
  );
  const { setSeo, resetSeo, defaults } = useSeo();
  const articleJsonLd = (0, import_react18.useMemo)(() => {
    const baseDescription = defaults?.description || "Discover practical tips for UK families to save money on groceries, energy bills, and everyday expenses.";
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: baseDescription,
      image: [post.imageUrl],
      author: {
        "@type": "Organization",
        name: post.author
      },
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      articleSection: post.category,
      keywords: post.tags.join(", "),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": defaults?.canonical || defaults?.ogUrl || "https://www.calcmymoney.co.uk/blog-smart-money-saving-tips"
      },
      publisher: {
        "@type": "Organization",
        name: "Calculate My Money",
        logo: {
          "@type": "ImageObject",
          url: "https://www.calcmymoney.co.uk/images/logo-high-res.webp"
        }
      }
    };
  }, [defaults?.canonical, defaults?.description, defaults?.ogUrl, post]);
  (0, import_react18.useEffect)(() => {
    const baseJsonLd = Array.isArray(defaults?.jsonLd) ? defaults.jsonLd : [];
    const combinedJsonLd = articleJsonLd ? [...baseJsonLd, articleJsonLd] : baseJsonLd;
    setSeo({
      ogType: "article",
      ogImage: post.imageUrl,
      ogImageAlt: post.imageAlt,
      twitterImage: post.imageUrl,
      twitterImageAlt: post.imageAlt,
      articlePublishedTime: post.publishedTime,
      articleModifiedTime: post.modifiedTime,
      articleSection: post.category,
      articleAuthor: post.author,
      articleTags: post.tags,
      jsonLd: combinedJsonLd
    });
    return () => {
      resetSeo();
    };
  }, [articleJsonLd, defaults?.jsonLd, post, resetSeo, setSeo]);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "bg-background py-12", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("article", { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      Link,
      {
        to: createPageUrl("Blog"),
        className: "mb-8 inline-flex items-center text-primary hover:underline",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          "Back to all articles"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("header", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "bg-pill text-pill-foreground px-3 py-1 rounded-full text-sm font-medium", children: post.category }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "mt-4 mb-4 text-foreground", children: post.title }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(User, { className: "w-4 h-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { children: post.author })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Calendar, { className: "w-4 h-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("time", { dateTime: post.publishedTime, children: post.displayDate })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Clock, { className: "w-4 h-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { children: post.readTime })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
      "img",
      {
        src: createUnsplashUrl(heroImage.baseUrl, heroImage.params, heroImage.width),
        srcSet: createUnsplashSrcSet(
          heroImage.baseUrl,
          heroImage.params,
          heroImage.srcSetWidths
        ),
        sizes: heroImage.sizes,
        alt: post.imageAlt,
        width: heroImage.width,
        height: heroImage.height,
        loading: "eager",
        decoding: "async",
        className: "w-full h-auto max-h-[400px] object-cover rounded-lg mb-8"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "prose prose-lg dark:prose-invert max-w-none mx-auto text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "lead", children: "The cost of living in the UK continues to be a hot topic, with rising prices hitting household budgets hard. This guide focuses on two of the biggest drains on family finances \u2013 groceries and energy bills \u2013 offering actionable tips specifically for UK households." }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Separator2, { className: "my-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h2", size: "h2", className: "heading-2", children: "Winning the Grocery Game: Strategies for the Supermarket" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { children: "Groceries are often one of the largest flexible expenses for families. Small changes here can lead to significant savings." }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("ul", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Meal Planning is Your Superpower:" }),
          " Before you even step foot in the supermarket, plan out every meal for the week. This prevents impulse buys and reduces food waste."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Shop Your Pantry First:" }),
          ' Before making your shopping list, "shop" your own fridge, freezer, and cupboards. You might be surprised what you already have.'
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Embrace 'Wonky' Veg & Own Brands:" }),
          ` Supermarkets often sell "imperfect" vegetables at a discount. They taste exactly the same! Similarly, don't shy away from own-brand products.`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Batch Cooking for Busy Weeks:" }),
          " Dedicate a few hours on a weekend to cook larger portions of staples like pasta sauce or chili. Freeze individual portions for quick, cheap, and healthy meals on busy weeknights."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "my-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "img",
          {
            src: createUnsplashUrl(
              groceriesImage.baseUrl,
              groceriesImage.params,
              groceriesImage.width
            ),
            srcSet: createUnsplashSrcSet(
              groceriesImage.baseUrl,
              groceriesImage.params,
              groceriesImage.srcSetWidths
            ),
            sizes: groceriesImage.sizes,
            alt: groceriesImage.alt,
            width: groceriesImage.width,
            height: groceriesImage.height,
            loading: "lazy",
            decoding: "async",
            className: "w-full h-64 object-cover rounded-lg"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Meal planning and smart shopping can dramatically reduce your grocery spend" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h2", size: "h2", className: "heading-2", children: "Taming the Energy Beast: Heating, Lighting & Appliances" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { children: "With fluctuating energy prices, making your home more energy-efficient is key." }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("ul", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Understand Your Usage:" }),
          " Many smart meters or online accounts provide a detailed breakdown of your energy consumption. Identify peak usage times or 'energy hungry' appliances."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Smart Thermostat & Zoned Heating:" }),
          " Invest in a smart thermostat that learns your habits or allows you to control heating from your phone. Only heat the rooms you're using."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Appliance Awareness:" }),
          " Run washing machines and dishwashers only on full loads, wash clothes at 30\xB0C, and unplug devices left on standby."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "LED Lighting:" }),
          " Switch to LED bulbs. They use significantly less energy and last much longer than traditional bulbs."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "my-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "img",
          {
            src: createUnsplashUrl(
              thermostatImage.baseUrl,
              thermostatImage.params,
              thermostatImage.width
            ),
            srcSet: createUnsplashSrcSet(
              thermostatImage.baseUrl,
              thermostatImage.params,
              thermostatImage.srcSetWidths
            ),
            sizes: thermostatImage.sizes,
            alt: thermostatImage.alt,
            width: thermostatImage.width,
            height: thermostatImage.height,
            loading: "lazy",
            decoding: "async",
            className: "w-full h-64 object-cover rounded-lg"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Smart home technology can help you take control of your energy usage" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h2", size: "h2", className: "heading-2", children: "Quick Wins: Small Changes, Big Impact" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { children: "Sometimes the smallest adjustments yield the greatest results:" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("ul", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Loyalty Programs:" }),
          " Use supermarket loyalty cards and apps \u2013 they often offer personalized discounts."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Energy Supplier Switching:" }),
          " Use comparison sites to ensure you're on the best tariff for your usage."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Water-Saving Devices:" }),
          " Simple devices like shower timers or low-flow showerheads can reduce both water and energy bills."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("strong", { children: "Draft Proofing:" }),
          " Seal gaps around windows and doors \u2013 it's cheap and effective."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Separator2, { className: "my-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h2", size: "h2", className: "heading-2", children: "Making it Sustainable: The Long Game" }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { children: "The key to lasting financial change isn't dramatic overnight transformations \u2013 it's building sustainable habits that compound over time. Start with one or two changes from this guide, master them, then gradually add more. Your future self (and your bank account) will thank you." }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Card, { className: "my-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Heading_default, { as: "h3", size: "h4", className: "mb-3 text-green-800 dark:text-green-200", children: "\u{1F4A1} Pro Tip: Track Your Progress" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("p", { className: "text-green-700 dark:text-green-300", children: [
          "Use our",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Link, { to: createPageUrl("BudgetCalculator"), className: "underline font-medium", children: "Budget Planner" }),
          " ",
          "to track your grocery and energy spending before and after implementing these tips. Seeing the actual numbers will keep you motivated!"
        ] })
      ] }) })
    ] })
  ] }) }) });
}

// src/pages/BlogDebtRepaymentStrategies.jsx
var import_react19 = __toESM(require_react(), 1);
var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);
var createUnsplashUrl2 = (baseUrl, params, width) => `${baseUrl}?${params}&w=${width}`;
var createUnsplashSrcSet2 = (baseUrl, params, widths) => widths.map((width) => `${createUnsplashUrl2(baseUrl, params, width)} ${width}w`).join(", ");
function BlogDebtRepaymentStrategies() {
  const post = (0, import_react19.useMemo)(
    () => ({
      title: "Debt Snowball vs. Debt Avalanche: Which UK Debt Repayment Strategy is Right for You?",
      category: "Debt Management",
      readTime: "6 min read",
      author: "CalcMyMoney Team",
      displayDate: "October 24, 2023",
      publishedTime: "2023-10-24T08:00:00+00:00",
      modifiedTime: "2023-10-24T08:00:00+00:00",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Person organizing financial documents and calculating debt payments",
      tags: ["Debt Repayment", "Personal Finance", "UK Debt Advice", "Budgeting"]
    }),
    []
  );
  const heroImage = (0, import_react19.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1280,
      height: 853,
      srcSetWidths: [480, 768, 1024, 1280],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 896px"
    }),
    []
  );
  const avalancheImage = (0, import_react19.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Calculator and financial documents showing debt reduction strategy planning"
    }),
    []
  );
  const successImage = (0, import_react19.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Person celebrating financial success with calculator and paperwork"
    }),
    []
  );
  const { setSeo, resetSeo, defaults } = useSeo();
  const articleJsonLd = (0, import_react19.useMemo)(() => {
    const baseDescription = defaults?.description || "Compare the debt snowball and debt avalanche methods to find the best UK debt repayment strategy for your situation.";
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: baseDescription,
      image: [post.imageUrl],
      author: {
        "@type": "Organization",
        name: post.author
      },
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      articleSection: post.category,
      keywords: post.tags.join(", "),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": defaults?.canonical || defaults?.ogUrl || "https://www.calcmymoney.co.uk/blog-debt-repayment-strategies"
      },
      publisher: {
        "@type": "Organization",
        name: "Calculate My Money",
        logo: {
          "@type": "ImageObject",
          url: "https://www.calcmymoney.co.uk/images/logo-high-res.webp"
        }
      }
    };
  }, [defaults?.canonical, defaults?.description, defaults?.ogUrl, post]);
  (0, import_react19.useEffect)(() => {
    const baseJsonLd = Array.isArray(defaults?.jsonLd) ? defaults.jsonLd : [];
    const combinedJsonLd = articleJsonLd ? [...baseJsonLd, articleJsonLd] : baseJsonLd;
    setSeo({
      ogType: "article",
      ogImage: post.imageUrl,
      ogImageAlt: post.imageAlt,
      twitterImage: post.imageUrl,
      twitterImageAlt: post.imageAlt,
      articlePublishedTime: post.publishedTime,
      articleModifiedTime: post.modifiedTime,
      articleSection: post.category,
      articleAuthor: post.author,
      articleTags: post.tags,
      jsonLd: combinedJsonLd
    });
    return () => {
      resetSeo();
    };
  }, [articleJsonLd, defaults?.jsonLd, post, resetSeo, setSeo]);
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "bg-white dark:bg-gray-900 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
      Link,
      {
        to: createPageUrl("Blog"),
        className: "inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          "Back to all articles"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("article", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("header", { className: "mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-red-900/50 dark:text-red-300", children: post.category }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
          Heading_default,
          {
            as: "h1",
            size: "h1",
            weight: "bold",
            className: "text-gray-900 dark:text-gray-100 mt-4 mb-4",
            children: post.title
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(User, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: post.author })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Calendar, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("time", { dateTime: post.publishedTime, children: post.displayDate })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Clock, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: post.readTime })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
        "img",
        {
          src: createUnsplashUrl2(heroImage.baseUrl, heroImage.params, heroImage.width),
          srcSet: createUnsplashSrcSet2(
            heroImage.baseUrl,
            heroImage.params,
            heroImage.srcSetWidths
          ),
          sizes: heroImage.sizes,
          alt: post.imageAlt,
          width: heroImage.width,
          height: heroImage.height,
          loading: "eager",
          decoding: "async",
          className: "w-full h-auto max-h-[400px] object-cover rounded-lg mb-8"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "prose prose-lg dark:prose-invert max-w-none mx-auto text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "lead text-xl", children: "When you're drowning in debt, every pound counts, and every strategy matters. Two approaches have emerged as the most popular methods for UK residents tackling multiple debts: the debt snowball and the debt avalanche. But which one is right for you?" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Separator2, { className: "my-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "Understanding the Debt Avalanche Method" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(TrendingDown, { className: "w-6 h-6 text-red-600" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-lg font-semibold text-red-800 dark:text-red-300 mb-0", children: "Mathematically Optimal" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "The debt avalanche method focuses on paying off debts with the highest interest rates first, while making minimum payments on all other debts. This approach minimizes the total amount of interest you'll pay over the life of your debts." }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "my-6 p-6 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h3", { className: "text-lg font-semibold text-red-800 dark:text-red-200 mb-3", children: "How Debt Avalanche Works:" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ol", { className: "list-decimal list-inside space-y-2 text-red-700 dark:text-red-300", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "List all your debts with their interest rates" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Arrange them from highest to lowest APR" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Pay minimums on all debts" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Put any extra money toward the highest interest debt" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Once paid off, move to the next highest rate" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            "img",
            {
              src: createUnsplashUrl2(
                avalancheImage.baseUrl,
                avalancheImage.params,
                avalancheImage.width
              ),
              srcSet: createUnsplashSrcSet2(
                avalancheImage.baseUrl,
                avalancheImage.params,
                avalancheImage.srcSetWidths
              ),
              sizes: avalancheImage.sizes,
              alt: avalancheImage.alt,
              width: avalancheImage.width,
              height: avalancheImage.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-64 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "The debt avalanche method focuses on mathematical optimization to save money" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "Understanding the Debt Snowball Method" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Target, { className: "w-6 h-6 text-blue-600" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-lg font-semibold text-blue-800 dark:text-blue-300 mb-0", children: "Psychologically Motivating" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "The debt snowball method focuses on paying off the smallest balances first, regardless of interest rate. This approach prioritizes quick wins and psychological momentum over mathematical optimization." }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "my-6 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h3", { className: "text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3", children: "How Debt Snowball Works:" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ol", { className: "list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-300", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "List all your debts from smallest to largest balance" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Pay minimums on all debts" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Put any extra money toward the smallest balance" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Once paid off, add that payment to the next smallest debt" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Watch your momentum build with each victory" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "Real UK Example: Sarah's Debt Journey" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Let's look at Sarah, a teacher from Birmingham, with typical UK debts:" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "grid md:grid-cols-2 gap-6 my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Card, { className: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h4", { className: "font-semibold mb-3", children: "Sarah's Debts:" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ul", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Credit Card 1: \xA32,500 @ 22.9% APR" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Credit Card 2: \xA31,200 @ 18.9% APR" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Store Card: \xA3800 @ 28.9% APR" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Personal Loan: \xA34,500 @ 9.9% APR" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "Car Finance: \xA36,200 @ 7.5% APR" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-300 dark:border-gray-600", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { children: "Total Debt: \xA315,200" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Extra monthly payment: \xA3300" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Card, { className: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h4", { className: "font-semibold mb-3 text-green-800 dark:text-green-200", children: "Results Comparison:" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "space-y-4 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h5", { className: "font-medium text-red-700 dark:text-red-300", children: "Debt Avalanche:" }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Time to debt-free: 3.2 years" }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Total interest: \xA32,847" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h5", { className: "font-medium text-blue-700 dark:text-blue-300", children: "Debt Snowball:" }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Time to debt-free: 3.4 years" }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Total interest: \xA33,156" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "pt-2 border-t border-green-300 dark:border-green-600", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "font-medium", children: "Avalanche saves: \xA3309" }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "Which Method Should You Choose?" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "grid md:grid-cols-2 gap-6 my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Card, { className: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h4", { className: "font-semibold text-red-800 dark:text-red-200 mb-3", children: "Choose Debt Avalanche If:" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ul", { className: "space-y-2 text-red-700 dark:text-red-300", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You're motivated by saving money" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You can stick to a plan without quick wins" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You have high-interest debts (credit cards, store cards)" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You're analytical and numbers-driven" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You want to minimize total interest paid" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h4", { className: "font-semibold text-blue-800 dark:text-blue-200 mb-3", children: "Choose Debt Snowball If:" }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ul", { className: "space-y-2 text-blue-700 dark:text-blue-300", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You need motivation from quick wins" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You've struggled with debt plans before" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 Your interest rates are fairly similar" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You're emotionally driven" }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { children: "\u2022 You want to simplify your financial life faster" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "UK-Specific Considerations" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "When choosing your debt repayment strategy in the UK, keep these factors in mind:" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { children: "Student Loans:" }),
            " Generally keep these last due to low interest rates and income-dependent repayments"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { children: "Council Tax Debt:" }),
            " Always prioritize this - bailiffs can be used for enforcement"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { children: "Mortgage vs Credit Cards:" }),
            " Focus on high-interest credit cards before overpaying your mortgage"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { children: "0% Balance Transfer Cards:" }),
            " Can be powerful tools when used with either strategy"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            "img",
            {
              src: createUnsplashUrl2(
                successImage.baseUrl,
                successImage.params,
                successImage.width
              ),
              srcSet: createUnsplashSrcSet2(
                successImage.baseUrl,
                successImage.params,
                successImage.srcSetWidths
              ),
              sizes: successImage.sizes,
              alt: successImage.alt,
              width: successImage.width,
              height: successImage.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-64 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Both strategies can lead to debt freedom - choose the one that fits your personality" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Separator2, { className: "my-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Heading_default, { as: "h2", size: "h2", children: "The Bottom Line" }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: `The "perfect" debt repayment strategy is the one you'll actually stick to. While the debt avalanche saves more money mathematically, the debt snowball's psychological benefits can be game-changing for many people.` }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { children: "Remember: the difference in interest paid is often less significant than the difference between having a plan and not having one at all." }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Card, { className: "my-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h3", { className: "text-lg font-semibold text-green-800 dark:text-green-200 mb-3", children: "\u{1F9EE} Ready to Run Your Numbers?" }),
          /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("p", { className: "text-green-700 dark:text-green-300", children: [
            "Use our",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Link, { to: createPageUrl("DebtCalculator"), className: "underline font-medium", children: "Debt Repayment Calculator" }),
            " ",
            "to compare both strategies with your actual debts and see which approach works best for your situation."
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}

// src/pages/BlogFinancialPsychology.jsx
var import_react20 = __toESM(require_react(), 1);
var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);
var createUnsplashUrl3 = (baseUrl, params, width) => `${baseUrl}?${params}&w=${width}`;
var createUnsplashSrcSet3 = (baseUrl, params, widths) => widths.map((width) => `${createUnsplashUrl3(baseUrl, params, width)} ${width}w`).join(", ");
function BlogFinancialPsychology() {
  const post = (0, import_react20.useMemo)(
    () => ({
      title: "My Relationship with Money: A Guide to Financial Psychology",
      category: "Mindset",
      readTime: "8 min read",
      author: "CalcMyMoney Team",
      displayDate: "October 22, 2023",
      publishedTime: "2023-10-22T08:00:00+00:00",
      modifiedTime: "2023-10-22T08:00:00+00:00",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Person meditating with financial symbols and growth charts in the background",
      tags: ["Financial Psychology", "Money Mindset", "Behavioural Finance", "Personal Finance"]
    }),
    []
  );
  const heroImage = (0, import_react20.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1280,
      height: 853,
      srcSetWidths: [480, 768, 1024, 1280],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 896px"
    }),
    []
  );
  const childhoodMoneyImage = (0, import_react20.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Child's hands holding coins, representing early money experiences"
    }),
    []
  );
  const breakingBeliefsImage = (0, import_react20.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Person breaking free from chains, representing breaking limiting money beliefs"
    }),
    []
  );
  const celebrationImage = (0, import_react20.useMemo)(
    () => ({
      baseUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      params: "q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px",
      alt: "Person celebrating success with arms raised against sunset"
    }),
    []
  );
  const { setSeo, resetSeo, defaults } = useSeo();
  const articleJsonLd = (0, import_react20.useMemo)(() => {
    const baseDescription = defaults?.description || "Understand the psychology behind your spending and saving habits and how mindset impacts financial wellbeing in the UK.";
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: baseDescription,
      image: [post.imageUrl],
      author: {
        "@type": "Organization",
        name: post.author
      },
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      articleSection: post.category,
      keywords: post.tags.join(", "),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": defaults?.canonical || defaults?.ogUrl || "https://www.calcmymoney.co.uk/blog-financial-psychology"
      },
      publisher: {
        "@type": "Organization",
        name: "Calculate My Money",
        logo: {
          "@type": "ImageObject",
          url: "https://www.calcmymoney.co.uk/images/logo-high-res.webp"
        }
      }
    };
  }, [defaults?.canonical, defaults?.description, defaults?.ogUrl, post]);
  (0, import_react20.useEffect)(() => {
    const baseJsonLd = Array.isArray(defaults?.jsonLd) ? defaults.jsonLd : [];
    const combinedJsonLd = articleJsonLd ? [...baseJsonLd, articleJsonLd] : baseJsonLd;
    setSeo({
      ogType: "article",
      ogImage: post.imageUrl,
      ogImageAlt: post.imageAlt,
      twitterImage: post.imageUrl,
      twitterImageAlt: post.imageAlt,
      articlePublishedTime: post.publishedTime,
      articleModifiedTime: post.modifiedTime,
      articleSection: post.category,
      articleAuthor: post.author,
      articleTags: post.tags,
      jsonLd: combinedJsonLd
    });
    return () => {
      resetSeo();
    };
  }, [articleJsonLd, defaults?.jsonLd, post, resetSeo, setSeo]);
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "bg-white dark:bg-gray-900 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
      Link,
      {
        to: createPageUrl("Blog"),
        className: "inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          "Back to all articles"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("article", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("header", { className: "mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-purple-900/50 dark:text-purple-300", children: post.category }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
          Heading_default,
          {
            as: "h1",
            size: "h1",
            weight: "bold",
            className: "text-gray-900 dark:text-gray-100 mt-4 mb-4",
            children: post.title
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(User, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: post.author })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Calendar, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("time", { dateTime: post.publishedTime, children: post.displayDate })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Clock, { className: "w-4 h-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: post.readTime })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
        "img",
        {
          src: createUnsplashUrl3(heroImage.baseUrl, heroImage.params, heroImage.width),
          srcSet: createUnsplashSrcSet3(
            heroImage.baseUrl,
            heroImage.params,
            heroImage.srcSetWidths
          ),
          sizes: heroImage.sizes,
          alt: post.imageAlt,
          width: heroImage.width,
          height: heroImage.height,
          loading: "eager",
          decoding: "async",
          className: "w-full h-auto max-h-[400px] object-cover rounded-lg mb-8"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "prose prose-lg dark:prose-invert max-w-none mx-auto text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "lead text-xl", children: "Money isn't just numbers on a screen or notes in your wallet. It's deeply personal, emotional, and tied to our core beliefs about security, success, and self-worth. Understanding your relationship with money might be the most important financial skill you never learned in school." }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Separator2, { className: "my-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "The Hidden Forces Shaping Your Money Decisions" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Brain, { className: "w-6 h-6 text-purple-600" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-lg font-semibold text-purple-800 dark:text-purple-300 mb-0", children: "It's All in Your Head (And That's OK)" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Every time you make a financial decision \u2013 whether it's buying a coffee, choosing a pension contribution, or avoiding looking at your bank balance \u2013 you're being influenced by deeply ingrained psychological patterns." }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "These patterns were formed early in life through:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: "Family messages:" }),
            " What did your parents say (or not say) about money?"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: "Early experiences:" }),
            " Did you experience financial stress, abundance, or unpredictability?"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: "Cultural influences:" }),
            " What does your community/society say about wealth and poverty?"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: "Personal experiences:" }),
            " Your wins, losses, and lessons with money over time"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            "img",
            {
              src: createUnsplashUrl3(
                childhoodMoneyImage.baseUrl,
                childhoodMoneyImage.params,
                childhoodMoneyImage.width
              ),
              srcSet: createUnsplashSrcSet3(
                childhoodMoneyImage.baseUrl,
                childhoodMoneyImage.params,
                childhoodMoneyImage.srcSetWidths
              ),
              sizes: childhoodMoneyImage.sizes,
              alt: childhoodMoneyImage.alt,
              width: childhoodMoneyImage.width,
              height: childhoodMoneyImage.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-64 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Our earliest money memories often shape our adult financial behaviors" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "The Four Common UK Money Personalities" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Most people fall into one (or a combination) of these money personality types. Recognizing yourself can be the first step toward financial awareness:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "grid md:grid-cols-2 gap-6 my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Card, { className: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: "font-semibold text-red-800 dark:text-red-200 mb-3", children: "\u{1F4B8} The Spender" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-red-700 dark:text-red-300 text-sm mb-3", children: "Money is for enjoying life and showing love" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { className: "text-red-700 dark:text-red-300 text-sm space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Shops to feel better" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Generous with others" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Lives in the moment" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Struggles with saving" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: "font-semibold text-blue-800 dark:text-blue-200 mb-3", children: "\u{1F3E6} The Saver" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-blue-700 dark:text-blue-300 text-sm mb-3", children: "Money equals security and peace of mind" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { className: "text-blue-700 dark:text-blue-300 text-sm space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Always has an emergency fund" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Conservative with investments" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Plans for the future" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 May miss out on experiences" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Card, { className: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: "font-semibold text-green-800 dark:text-green-200 mb-3", children: "\u{1F4CA} The Investor" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-green-700 dark:text-green-300 text-sm mb-3", children: "Money should work hard and grow" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { className: "text-green-700 dark:text-green-300 text-sm space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Loves researching opportunities" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Comfortable with calculated risks" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Focuses on long-term wealth" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 May neglect present enjoyment" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Card, { className: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 mb-3", children: "\u{1F648} The Avoider" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-gray-700 dark:text-gray-300 text-sm mb-3", children: "Money is stressful and overwhelming" }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { className: "text-gray-700 dark:text-gray-300 text-sm space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Avoids checking bank statements" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Delegates financial decisions" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 Feels overwhelmed by choices" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "\u2022 May miss financial opportunities" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "Common Money Myths That Hold Us Back" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Many of the beliefs we hold about money aren't actually true, but they feel true because we've never questioned them. Here are some common ones among UK residents:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "my-6 p-6 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-semibold text-amber-800 dark:text-amber-200", children: `\u274C "I'm just bad with money"` }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-amber-700 dark:text-amber-300 text-sm", children: "\u2705 Money management is a learnable skill, not a fixed trait." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-semibold text-amber-800 dark:text-amber-200", children: '\u274C "Rich people are greedy/lucky/different"' }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-amber-700 dark:text-amber-300 text-sm", children: "\u2705 Wealth often comes from consistent habits and informed decisions over time." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-semibold text-amber-800 dark:text-amber-200", children: '\u274C "I need to earn more before I can save"' }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-amber-700 dark:text-amber-300 text-sm", children: "\u2705 Small amounts saved consistently can grow significantly over time." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "font-semibold text-amber-800 dark:text-amber-200", children: '\u274C "Investing is only for the wealthy"' }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-amber-700 dark:text-amber-300 text-sm", children: "\u2705 You can start investing with as little as \xA325 per month in the UK." })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            "img",
            {
              src: createUnsplashUrl3(
                breakingBeliefsImage.baseUrl,
                breakingBeliefsImage.params,
                breakingBeliefsImage.width
              ),
              srcSet: createUnsplashSrcSet3(
                breakingBeliefsImage.baseUrl,
                breakingBeliefsImage.params,
                breakingBeliefsImage.srcSetWidths
              ),
              sizes: breakingBeliefsImage.sizes,
              alt: breakingBeliefsImage.alt,
              width: breakingBeliefsImage.width,
              height: breakingBeliefsImage.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-64 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Breaking free from limiting money beliefs opens up new financial possibilities" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "The UK Context: Cultural Money Messages" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "In the UK, we have some unique cultural attitudes toward money that can impact our financial wellbeing:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: `"Money doesn't buy happiness"` }),
            " \u2013 While true to an extent, this can justify underearning or avoiding financial goals"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: `"It's rude to discuss money"` }),
            " \u2013 This taboo prevents us from learning from others and getting help when needed"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: '"Keep calm and carry on"' }),
            " \u2013 Our stiff upper lip can prevent us from addressing financial stress"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("strong", { children: '"Class consciousness"' }),
            ' \u2013 Ideas about "our place" can limit financial aspirations'
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "Rewiring Your Money Mindset: Practical Steps" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Target, { className: "w-6 h-6 text-green-600" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-lg font-semibold text-green-800 dark:text-green-300 mb-0", children: "Small Changes, Big Impact" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { children: "1. Practice Money Mindfulness" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Before making any purchase over \xA320, pause and ask yourself:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "What emotion am I feeling right now?" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "What do I hope this purchase will give me?" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "Is this aligned with my values and goals?" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { children: "2. Reframe Your Money Stories" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: `Instead of "I can't afford it," try "That's not a priority for me right now." This shifts you from victim to empowered decision-maker.` }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { children: "3. Set Values-Based Goals" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Rather than arbitrary targets, connect your financial goals to what matters most to you:" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "Security: Emergency fund for peace of mind" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "Freedom: Savings for career flexibility" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "Family: University fund for children" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("li", { children: "Adventure: Travel fund for experiences" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { children: "4. Celebrate Small Wins" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Acknowledge progress, no matter how small. Saved your first \xA3100? Celebrate! Increased your pension contribution? That's worth recognizing!" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "my-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            "img",
            {
              src: createUnsplashUrl3(
                celebrationImage.baseUrl,
                celebrationImage.params,
                celebrationImage.width
              ),
              srcSet: createUnsplashSrcSet3(
                celebrationImage.baseUrl,
                celebrationImage.params,
                celebrationImage.srcSetWidths
              ),
              sizes: celebrationImage.sizes,
              alt: celebrationImage.alt,
              width: celebrationImage.width,
              height: celebrationImage.height,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-64 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic", children: "Celebrating financial wins, big and small, reinforces positive money habits" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Separator2, { className: "my-8" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Heading_default, { as: "h2", size: "h2", children: "Your Money, Your Journey" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: `There's no "perfect" relationship with money, just like there's no perfect relationship with anything else that matters. The goal isn't to eliminate all emotion from your financial decisions \u2013 that's impossible and unnecessary.` }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("p", { children: [
          "Instead, the goal is ",
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("em", { children: "awareness" }),
          ". When you understand why you make the financial choices you do, you can make more intentional decisions that align with your true values and long-term wellbeing."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { children: "Remember: changing your relationship with money is a process, not a destination. Be patient with yourself as you unlearn old patterns and create new, healthier ones." }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Card, { className: "my-8 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { className: "text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3", children: "\u{1F4AD} Ready to Transform Your Future?" }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("p", { className: "text-purple-700 dark:text-purple-300", children: [
            "Start putting these insights into practice with our",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              Link,
              {
                to: createPageUrl("DreamLifestyleCalculator"),
                className: "underline font-medium",
                children: "Dream Lifestyle Calculator"
              }
            ),
            ". Discover what your ideal life costs and create a values-based plan to get there."
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}

// src/pages/BlogWhyCalculationsMatter.jsx
var import_react21 = __toESM(require_react(), 1);
var import_jsx_runtime30 = __toESM(require_jsx_runtime(), 1);
var canonical = "https://www.calcmymoney.co.uk/blog/why-small-calculations-matter";
var title = "The Math Behind a Good Life: Why Small Money Calculations Change Big Outcomes";
var description = "We work hard for every pound. Here\u2019s how tiny money calculations\u2014salary, tax, mortgage, budgeting\u2014create calm, confident decisions.";
function BlogWhyCalculationsMatter() {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(SeoHead, { title: "Why Small Money Calculations Matter | CalcMyMoney", desc: description, canonical }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      JsonLd,
      {
        data: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          author: { "@type": "Organization", name: "CalcMyMoney" },
          publisher: { "@type": "Organization", name: "CalcMyMoney" },
          datePublished: (/* @__PURE__ */ new Date()).toISOString(),
          mainEntityOfPage: canonical
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 p-3", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Calculator, { className: "w-6 h-6 text-blue-700 dark:text-blue-300", role: "img", "aria-label": "Calculator icon" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-2", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto", children: "People don\u2019t want spreadsheets; we want a good life. But a good life is often built from small, calm calculations done at the right time. The numbers won\u2019t decide for you\u2014yet they make your choices clearer, kinder and more confident." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("main", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "space-y-8 text-gray-800 dark:text-gray-200", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { className: "space-y-4 text-base md:text-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { children: "In the UK, we work hard for every pound. We also make hundreds of tiny financial decisions each month\u2014how much to save, what to pay off, which tariff to choose, whether a salary offer really stretches. When we skip these small sums, uncertainty grows and stress follows." }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { children: "The fix isn\u2019t more jargon. It\u2019s quick, practical calculations that respect both your feelings and your facts. A two\u2011minute check on salary, tax or mortgage payments can turn \u201CI hope this is fine\u201D into \u201CI know this works for us.\u201D" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "feelings-numbers", className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "feelings-numbers", className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Feelings are real. Numbers are revealing." }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "Money isn\u2019t just maths; it\u2019s meaning. That\u2019s why a pay rise might feel underwhelming after tax, or a mortgage quote seems high until you see the total interest saved by a small overpayment. Numbers translate the fuzzy into the familiar. They don\u2019t dismiss feelings\u2014they give them context." }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("p", { className: "text-base md:text-lg", children: [
          "The best time to calculate is right before a decision: assessing a new role with a",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/salary-calculator-uk", className: "text-blue-600 hover:underline", children: " Salary Calculator" }),
          ", double\u2011checking take\u2011home with a",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/paye-calculator", className: "text-blue-600 hover:underline", children: " PAYE Calculator" }),
          ", or mapping repayments in a",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/mortgage-calculator-uk", className: "text-blue-600 hover:underline", children: " Mortgage Calculator" }),
          ". It\u2019s not complicated; it\u2019s caring for your future self."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "small-print", className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "small-print", className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "The small print is where your pay goes to hide" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "Deductions are big in the UK: Income Tax, National Insurance, pensions, student loans. They\u2019re sensible\u2014but they\u2019re also sneaky when you don\u2019t quantify them. A quick PAYE run\u2011through shows the truth: that \u201C\xA33,000 per month\u201D might be \xA32,350 in your account, and a 1% pension tweak could nudge your net pay more gently than you expect." }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "The same goes for home ownership. Two quotes can look similar until you compare rates, fees and term side by side. A small rate difference compounds across decades, and a tiny overpayment can carve years off your term. The right time to check? Before you sign." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "money-blueprint", className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "money-blueprint", className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Your Money Blueprint (and why you need one)" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "A blueprint is a simple, repeatable set of checks you run whenever money\u2019s on the move\u2014new job, new home, new plan. It\u2019s not a spreadsheet marathon. It\u2019s five minutes with the right tools:" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("ul", { className: "list-disc pl-5 space-y-2 text-base", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            "Estimate take\u2011home from a salary or offer using the",
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/salary-calculator-uk", className: "text-blue-600 hover:underline", children: " Salary Calculator" }),
            " and verify with the",
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/paye-calculator", className: "text-blue-600 hover:underline", children: " PAYE Calculator" }),
            "."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            "Stress\u2011test your home costs with the",
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/mortgage-calculator-uk", className: "text-blue-600 hover:underline", children: " Mortgage Calculator" }),
            "\u2014check interest changes, fees and terms."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            "Give every pound a home with the",
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/budget-calculator", className: "text-blue-600 hover:underline", children: " Budget Calculator" }),
            "\u2014then let it flex as life changes."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "When your blueprint lives in your head (and in a few bookmarked tools), financial admin stops being a burden and becomes a rhythm. The habit is the help." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "habits", className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "habits", className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Three habits that compound" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("ul", { className: "list-disc pl-5 space-y-3 text-base", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("strong", { children: "Check the real number." }),
            " What\u2019s the net figure, the monthly repayment, the total cost over time? When you know the real number, you steer better."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("strong", { children: "Decide with ranges, not guesses." }),
            " \u201CIf rates move \xB11%, are we still comfortable?\u201D \u201CIf income shifts next year, what changes?\u201D Ranges make plans resilient."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("strong", { children: "Make the next pound deliberate." }),
            " A tiny overpayment, an extra percentage into pension, or a small cut in a category\u2014none feels dramatic, yet together they change the year\u2019s story."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "cta", className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "cta", className: "sr-only", children: "Get started" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-base md:text-lg", children: "If you want calmer money decisions this year, try one quick calculation today. Estimate take\u2011home on a new salary, compare a mortgage scenario, or sketch a one\u2011page budget. You\u2019ll feel the shift from \u201CI\u2019m not sure\u201D to \u201CI\u2019ve got this.\u201D" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("p", { className: "text-base md:text-lg", children: [
          "Start with our most\u2011used tools:",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/salary-calculator-uk", className: "text-blue-600 hover:underline", children: " Salary Calculator" }),
          ",",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/paye-calculator", className: "text-blue-600 hover:underline", children: " PAYE Calculator" }),
          ",",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/mortgage-calculator-uk", className: "text-blue-600 hover:underline", children: " Mortgage Calculator" }),
          " ",
          "and the",
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("a", { href: "/budget-calculator", className: "text-blue-600 hover:underline", children: " Budget Calculator" }),
          ". Five minutes now can save five headaches later."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { "aria-labelledby": "related-tools", className: "mt-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { id: "related-tools", className: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Try these next" }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4", children: [
          {
            name: "Salary Calculator (UK)",
            href: "/salary-calculator-uk",
            desc: "See take\u2011home pay after tax, NI, pension and student loans."
          },
          {
            name: "PAYE Calculator",
            href: "/paye-calculator",
            desc: "Break down your payslip clearly\u2014no surprises on payday."
          },
          {
            name: "Mortgage Calculator",
            href: "/mortgage-calculator-uk",
            desc: "Estimate repayments and rate scenarios with fees and terms."
          },
          {
            name: "Budget Calculator",
            href: "/budget-calculator",
            desc: "Give every pound a job and reduce end\u2011of\u2011month stress."
          }
        ].map((c) => /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
          "a",
          {
            href: c.href,
            className: "block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: c.name }),
              /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "text-sm text-gray-600 dark:text-gray-300", children: c.desc })
            ]
          },
          c.name
        )) })
      ] })
    ] }) })
  ] });
}

// src/pages/JobSalaryPage.jsx
var import_react22 = __toESM(require_react(), 1);
var import_jsx_runtime31 = __toESM(require_jsx_runtime(), 1);
function JobSalaryPage() {
  const { slug } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setSeo, resetSeo } = useSeo();
  const selectedRole = (0, import_react22.useMemo)(
    () => jobTitles.find((job) => createSlug(job.title) === slug),
    [slug]
  );
  (0, import_react22.useEffect)(() => {
    if (!slug) {
      const params = new URLSearchParams(search);
      const legacy = params.get("slug");
      if (legacy) {
        navigate(`/job-salaries/${legacy}`, { replace: true });
      }
    }
  }, [slug, search, navigate]);
  (0, import_react22.useEffect)(() => {
    if (slug && !selectedRole) {
      resetSeo();
    }
  }, [slug, selectedRole, resetSeo]);
  if (!slug) {
    return null;
  }
  if (slug && !selectedRole) {
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(Navigate, { to: "/job-salaries", replace: true });
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const roleTitle = selectedRole.title;
  const salaryFormatter = (0, import_react22.useMemo)(
    () => new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }),
    []
  );
  const formatCurrency = (value) => salaryFormatter.format(Math.round(value));
  const averageSalary = selectedRole.averageSalary;
  const monthlySalary = averageSalary ? averageSalary / 12 : null;
  const weeklySalary = averageSalary ? averageSalary / 52 : null;
  const dailySalary = averageSalary ? averageSalary / 260 : null;
  const pageTitle = `${roleTitle} Salary (UK) | Job Pay Explorer`;
  const pageDesc = selectedRole.description ? `${selectedRole.description} Typical average salary: ${averageSalary ? `${formatCurrency(averageSalary)} per year` : "Explore pay insights"} in the UK.` : `Typical UK salary data for ${roleTitle}: pay ranges, percentiles, and related roles.`;
  const canonical3 = `${origin}/job-salaries/${slug}`;
  const relatedRoles = (0, import_react22.useMemo)(() => {
    if (!selectedRole?.category) return [];
    return jobTitles.filter(
      (job) => job.category === selectedRole.category && job.title !== selectedRole.title
    ).slice(0, 3);
  }, [selectedRole]);
  const statCards = [
    averageSalary ? {
      label: "Average salary",
      value: `${formatCurrency(averageSalary)}/yr`,
      helper: "Based on UK market data for this role."
    } : null,
    monthlySalary ? {
      label: "Estimated monthly pay",
      value: `${formatCurrency(monthlySalary)}/mo`,
      helper: "Approximate gross monthly earnings."
    } : null,
    weeklySalary ? {
      label: "Estimated weekly pay",
      value: `${formatCurrency(weeklySalary)}/wk`,
      helper: "Average annual salary divided over 52 weeks."
    } : null,
    dailySalary ? {
      label: "Estimated daily rate",
      value: `${formatCurrency(dailySalary)}/day`,
      helper: "Assuming ~260 working days per year."
    } : null
  ].filter(Boolean);
  (0, import_react22.useEffect)(() => {
    const seoPayload = {
      title: pageTitle,
      description: pageDesc,
      canonical: canonical3,
      robots: "index,follow,max-image-preview:large",
      ogTitle: pageTitle,
      ogDescription: pageDesc,
      ogUrl: canonical3,
      twitterTitle: pageTitle,
      twitterDescription: pageDesc
    };
    setSeo(seoPayload);
    return () => {
      resetSeo();
    };
  }, [canonical3, pageDesc, pageTitle, resetSeo, setSeo]);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "bg-white dark:bg-gray-900", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "max-w-5xl mx-auto px-4 py-8 space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(Link, { className: "text-blue-600 hover:text-blue-700 font-medium", to: "/job-salaries", children: "\u2190 Back to job salary explorer" }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [
          selectedRole.category && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(Badge, { variant: "secondary", className: "uppercase tracking-wide", children: selectedRole.category }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "text-sm text-gray-500", children: "Updated for the latest UK market data" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-3", children: [
          roleTitle,
          " salary (UK)"
        ] }),
        selectedRole.description && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-lg text-gray-700 dark:text-gray-300 max-w-3xl", children: selectedRole.description })
      ] })
    ] }),
    statCards.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "grid gap-4 sm:grid-cols-2", children: statCards.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(Card, { className: "bg-gray-50 dark:bg-gray-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(CardTitle, { className: "text-base text-gray-600 dark:text-gray-300", children: stat.label }) }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(CardContent, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100", children: stat.value }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2", children: stat.helper })
      ] })
    ] }, stat.label)) }),
    relatedRoles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "space-y-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900 dark:text-gray-100", children: [
        "Related roles in ",
        selectedRole.category
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "flex flex-wrap gap-2", children: relatedRoles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        Link,
        {
          to: `/job-salaries/${createSlug(role.title)}`,
          className: "px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100",
          children: role.title
        },
        role.title
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
      "Looking for another role? Explore the full list of UK salaries in our",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(Link, { className: "text-blue-600 hover:text-blue-700", to: "/job-salaries", children: "Job Salary Explorer" }),
      "."
    ] }) })
  ] }) });
}

// src/pages/CostOfLivingPage.jsx
var import_react23 = __toESM(require_react(), 1);
var import_jsx_runtime32 = __toESM(require_jsx_runtime(), 1);
var costOfLivingFAQs = [
  {
    question: "Where does this cost of living data come from?",
    answer: "The information on this page, particularly the Rent Index, is based on aggregated public data and rental market statistics. It is designed to provide a relative comparison between cities and should be used as a general guide. Actual costs will vary based on neighborhood, property type, and lifestyle."
  },
  {
    question: "What does the 'Rent Index' mean?",
    answer: "The Rent Index is a comparative score where London is set as the baseline (100). A city with a rent index of 70 means, on average, rental prices are about 30% cheaper than in London. It is a useful tool for quickly comparing housing affordability."
  },
  {
    question: "How can I create a budget for moving to this city?",
    answer: "That's a great next step! Once you have an idea of the relative costs, you can use our free Budget Planner tool to input your expected income and expenses to create a detailed personal budget."
  }
];
function CostOfLivingPage() {
  const { slug: rawSlug } = useParams();
  const costOfLivingBase = createPageUrl("CostOfLiving");
  const slug = (rawSlug || "").toLowerCase();
  const city = (0, import_react23.useMemo)(() => {
    if (!slug) return void 0;
    return ukCities.find((c) => createSlug(c.name) === slug);
  }, [slug]);
  if (!city) {
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "max-w-4xl mx-auto px-4 py-8 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", children: "City Not Found" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-gray-600", children: "The city you're looking for could not be found." }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
        Link,
        {
          to: costOfLivingBase,
          className: "mt-4 inline-block text-blue-600 hover:underline",
          children: "\u2190 Back to Cost of Living Explorer"
        }
      )
    ] });
  }
  const relatedCities = ukCities.filter((c) => c.region === city.region && c.name !== city.name).slice(0, 4);
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
      Link,
      {
        to: costOfLivingBase,
        className: "text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(ArrowLeft, { className: "w-4 h-4" }),
          "Back to All Cities"
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(Card, { className: "bg-white shadow-lg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(CardHeader, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Badge, { variant: "secondary", className: "w-fit mb-2", children: city.region }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(CardTitle, { className: "text-3xl font-extrabold text-gray-900", children: [
          "Cost of Living in ",
          city.name
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-lg text-gray-600", children: city.description })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(CardContent, { className: "space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "grid md:grid-cols-2 gap-4 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Users, { className: "w-8 h-8 mx-auto text-green-700 mb-2" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-sm text-green-800", children: "Population" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-2xl font-bold text-green-900", children: city.population })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "p-4 bg-purple-50 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(TrendingUp, { className: "w-8 h-8 mx-auto text-purple-700 mb-2" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-sm text-purple-800", children: "Rent Index vs London" }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-2xl font-bold text-purple-900", children: city.rentIndex })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "text-xl font-bold mb-4", children: "Cost Breakdown" }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { className: "text-gray-700 mb-4", children: [
            "The cost of living in ",
            city.name,
            " is an important factor for anyone considering moving to the area for work or study. While this data provides a general comparison, actual costs can vary significantly based on lifestyle, accommodation choices, and personal spending habits."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "flex items-center gap-4 p-3 bg-gray-100 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(House, { className: "w-6 h-6 text-gray-700 flex-shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h4", { className: "font-semibold", children: "Housing" }),
                /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { className: "text-sm text-gray-600", children: [
                  "Rental prices are a primary driver of cost differences. ",
                  city.name,
                  " has a rent index of ",
                  city.rentIndex,
                  ", meaning on average, rents are about",
                  " ",
                  100 - city.rentIndex,
                  "% lower than in London."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "flex items-center gap-4 p-3 bg-gray-100 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Utensils, { className: "w-6 h-6 text-gray-700 flex-shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h4", { className: "font-semibold", children: "Food & Groceries" }),
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-sm text-gray-600", children: "The cost of groceries and dining out is generally more consistent across the UK but tends to be higher in larger city centres, especially London." })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "flex items-center gap-4 p-3 bg-gray-100 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Bus, { className: "w-6 h-6 text-gray-700 flex-shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h4", { className: "font-semibold", children: "Transportation" }),
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-sm text-gray-600", children: "Public transport costs vary widely between cities. Major metropolitan areas like London have extensive but expensive networks, while other cities may have more affordable but less comprehensive options." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("h3", { className: "text-xl font-bold mb-4", children: [
            "Other Cities in ",
            city.region
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "space-y-2", children: relatedCities.length > 0 ? relatedCities.map((relatedCity) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            Link,
            {
              to: `${costOfLivingBase}/${createSlug(relatedCity.name)}`,
              className: "block p-3 bg-white border rounded-lg hover:bg-gray-100 transition-colors",
              children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "font-medium text-blue-700", children: relatedCity.name }),
                /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("span", { className: "font-semibold text-gray-800", children: [
                  "Rent Index: ",
                  relatedCity.rentIndex
                ] })
              ] })
            },
            relatedCity.name
          )) : /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-gray-600", children: "No other cities listed in this region." }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "text-xl font-bold mb-4", children: "Plan Your Budget" }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Card, { className: "bg-orange-50 border-orange-200", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { className: "text-orange-800 mb-4", children: [
              "Moving to ",
              city.name,
              "? Make sure you have a solid financial plan. Use our free budget planner to estimate your monthly income and expenses and see how much you can save."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Link, { to: createPageUrl("BudgetCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { className: "bg-orange-600 hover:bg-orange-700", children: "Open Budget Planner" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "pt-8 border-t", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(FAQSection, { faqs: costOfLivingFAQs, title: "About This Cost Data" }) })
      ] })
    ] })
  ] }) });
}

// src/pages/UKFinancialStats.jsx
var import_react24 = __toESM(require_react(), 1);

// src/components/seo/buildFaqJsonLd.js
function buildFaqJsonLd(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ question, answer }) => ({
      "@type": "Question",
      "name": String(question || "").trim(),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof answer === "string" ? answer : answer?.props ? "" : String(answer || "")
      }
    }))
  };
}

// src/components/seo/buildDatasetsJsonLd.js
function buildDatasetsJsonLd({ origin, canonical: canonical3, stats }) {
  const out = [];
  if (!stats || typeof stats !== "object") return out;
  const add = (obj) => out.push(obj);
  const isoOrNull = (v) => v && !Number.isNaN(new Date(v).getTime()) ? v : null;
  if (stats.bankRate && typeof stats.bankRate.value === "number") {
    const s = stats.bankRate;
    add({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Bank of England \u2013 Official Bank Rate",
      description: "Monthly policy interest rate (Bank Rate) set by the Monetary Policy Committee of the Bank of England.",
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      keywords: ["Bank Rate", "BoE", "interest rate", "UK monetary policy"],
      url: canonical3,
      sameAs: ["https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"],
      creator: {
        "@type": "Organization",
        name: "Bank of England",
        url: "https://www.bankofengland.co.uk/"
      },
      temporalCoverage: isoOrNull(s?.period?.start) || void 0,
      variableMeasured: {
        "@type": "PropertyValue",
        name: "Official Bank Rate",
        unitText: "PERCENT",
        value: s.value
      },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${origin}/api/boe/bank-rate`
      }
    });
  }
  if (stats.cpih && typeof stats.cpih.value === "number") {
    const s = stats.cpih;
    add({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "ONS \u2013 CPIH 12-month inflation rate",
      description: "UK CPIH 12-month inflation rate published by the Office for National Statistics.",
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      keywords: ["inflation", "CPIH", "ONS", "price indices", "UK"],
      url: canonical3,
      sameAs: ["https://www.ons.gov.uk/economy/inflationandpriceindices"],
      creator: {
        "@type": "Organization",
        name: "Office for National Statistics",
        url: "https://www.ons.gov.uk/"
      },
      temporalCoverage: isoOrNull(s?.period?.start) || void 0,
      variableMeasured: {
        "@type": "PropertyValue",
        name: "CPIH 12-month rate",
        unitText: "PERCENT",
        value: s.value
      },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${origin}/api/ons/cpih`
      }
    });
  }
  if (stats.housePrice && typeof stats.housePrice.value === "number") {
    const s = stats.housePrice;
    add({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "UK House Price Index \u2013 Average UK House Price",
      description: "Average UK house price from the UK House Price Index (HPI).",
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      keywords: ["UK HPI", "house prices", "property", "ONS", "Land Registry"],
      url: canonical3,
      sameAs: ["https://landregistry.data.gov.uk/app/hpi/"],
      creator: {
        "@type": "Organization",
        name: "HM Land Registry & ONS",
        url: "https://landregistry.data.gov.uk/"
      },
      temporalCoverage: isoOrNull(s?.period?.start) || void 0,
      variableMeasured: {
        "@type": "PropertyValue",
        name: "Average UK House Price",
        unitText: "GBP",
        value: s.value
      },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${origin}/api/ukhpi/average-price`
      }
    });
  }
  if (stats.ofgemCap && typeof stats.ofgemCap.value === "number") {
    const s = stats.ofgemCap;
    add({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ofgem \u2013 Energy Price Cap (typical household)",
      description: "Typical annualised energy price cap for a dual-fuel household on standard variable tariff.",
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      keywords: ["Ofgem", "energy price cap", "gas", "electricity", "UK energy"],
      url: canonical3,
      sameAs: ["https://www.ofgem.gov.uk/energy-price-cap"],
      creator: {
        "@type": "Organization",
        name: "Ofgem",
        url: "https://www.ofgem.gov.uk/"
      },
      temporalCoverage: isoOrNull(s?.period?.start) || void 0,
      variableMeasured: {
        "@type": "PropertyValue",
        name: "Energy Price Cap (typical annualised)",
        unitText: "GBP",
        value: s.value
      },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${origin}/api/ofgem/price-cap`
      }
    });
  }
  return out;
}

// src/pages/UKFinancialStats.jsx
var import_jsx_runtime33 = __toESM(require_jsx_runtime(), 1);
var percentFormatter = new Intl.NumberFormat("en-GB", {
  style: "decimal",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
var currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
var monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
function normalisePoundsSafe(s) {
  return String(s).replace(/&pound;|&#163;/gi, "\xA3");
}
function sanitizeNumber(val) {
  if (typeof val === "number") return Number.isFinite(val) ? val : NaN;
  if (typeof val === "string") {
    const s = normalisePoundsSafe(val);
    const num = parseFloat(s.replace(/[£,%\s,]/g, ""));
    return Number.isFinite(num) ? num : NaN;
  }
  return NaN;
}
function normalizeUnitSafe(u) {
  if (!u) return void 0;
  const s = String(u).toLowerCase();
  if (s === "percent" || s === "percentage" || s === "%") return "percent";
  if (s === "percentagepoints" || s === "percentage_points" || s === "pp") return "percentagePoints";
  if (s.includes("gbp") || s === "currency" || s.includes("\xA3")) return "gbp";
  return s;
}
function formatMonthYearISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(d);
}
var STAT_CONFIG = [
  {
    id: "bankRate",
    title: "BoE Bank Rate",
    icon: Landmark,
    link: "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp",
    endpoint: "/api/boe/bank-rate",
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime()) ? `Official Bank Rate as at ${monthFormatter.format(d)}.` : "Official rate set by the Bank of England.";
    }
  },
  {
    id: "cpih",
    title: "Inflation (CPIH)",
    icon: Percent,
    link: "https://www.ons.gov.uk/economy/inflationandpriceindices",
    endpoint: "/api/ons/cpih",
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime()) ? `12-month CPIH rate for ${monthFormatter.format(d)}.` : "12-month growth rate published by the ONS.";
    }
  },
  {
    id: "housePrice",
    title: "Average UK House Price",
    icon: House,
    link: "https://landregistry.data.gov.uk/app/hpi/",
    endpoint: "/api/ukhpi/average-price",
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime()) ? `UK HPI average for ${monthFormatter.format(d)}.` : "UK House Price Index nationwide average.";
    }
  },
  {
    id: "ofgemCap",
    title: "Ofgem Energy Price Cap",
    icon: Zap,
    link: "https://www.ofgem.gov.uk/energy-price-cap",
    endpoint: "/api/ofgem/price-cap",
    buildDescription: (stat) => {
      const s = stat?.period?.start ? new Date(stat.period.start) : null;
      const e = stat?.period?.end ? new Date(stat.period.end) : null;
      if (s && !Number.isNaN(s.getTime())) {
        const sL = monthFormatter.format(s);
        if (e && !Number.isNaN(e.getTime())) return `Cap for ${sL} - ${monthFormatter.format(e)}.`;
        return `Cap effective from ${sL}.`;
      }
      return "Typical household annualised cap published quarterly by Ofgem.";
    }
  }
];
var statsFaqs = [
  {
    question: "How often are these figures updated?",
    answer: "We check sources daily and cache results for a few hours. Bank Rate is updated after MPC decisions; CPIH is monthly; UK HPI is monthly; Ofgem price cap is typically quarterly. Exact refresh depends on each publisher\u2019s release schedule."
  },
  {
    question: "What is CPIH and how is it different from CPI?",
    answer: "CPIH is CPI including owner occupiers\u2019 housing costs (OOH). It\u2019s ONS\u2019s preferred headline measure for consumer price inflation in the UK."
  },
  {
    question: "Does the Ofgem price cap limit my total bill?",
    answer: "No. The cap limits unit rates and standing charges for a \u201Ctypical\u201D dual-fuel household. Your bill depends on actual usage and tariff type."
  },
  {
    question: "Why might my mortgage costs track Bank Rate?",
    answer: "Tracker and variable-rate mortgages often move with Bank Rate; fixes do not change until the fixed term ends. Always check your product\u2019s terms."
  },
  {
    question: "Where do these numbers come from?",
    answer: "Bank of England (Bank Rate), Office for National Statistics (CPIH), UK HPI (HM Land Registry & ONS), and Ofgem (energy price cap). We fetch directly from official pages or APIs."
  },
  {
    question: "Can I access the raw JSON used on this page?",
    answer: "Yes: /api/boe/bank-rate, /api/ons/cpih, /api/ukhpi/average-price, and /api/ofgem/price-cap. Endpoints return a simple, consistent shape for reuse."
  }
];
var isNum = (n) => typeof n === "number" && Number.isFinite(n);
function normalizeUnit(u) {
  if (!u) return void 0;
  const s = String(u).toLowerCase();
  if (s === "percent" || s === "percentage" || s === "%") return "percent";
  if (s === "percentagepoints" || s === "percentage_points" || s === "pp")
    return "percentagePoints";
  if (s.includes("gbp") || s === "currency" || s.includes("\xA3")) return "gbp";
  return s;
}
function normalizeStat(raw) {
  if (!raw || typeof raw !== "object") return null;
  let value = raw.value ?? raw.amount ?? raw.cap ?? (raw.data && raw.data.value) ?? (raw.metrics && raw.metrics.value);
  const numericValue = sanitizeNumber(value);
  if (!Number.isFinite(numericValue)) return null;
  let unit = raw.unit ?? raw.units ?? (raw.currency ? "gbp" : void 0) ?? (raw.percentage ? "percent" : void 0);
  unit = normalizeUnitSafe(unit);
  const period = raw.period ?? raw.dateRange ?? raw.dates ?? null;
  let change = raw.change ?? raw.delta ?? null;
  if (change && typeof change === "object") {
    const cv = sanitizeNumber(change.value);
    change = Number.isFinite(cv) ? { ...change, value: cv, unit: normalizeUnit(change.unit) } : null;
  }
  const source = raw.source ?? null;
  return {
    value: numericValue,
    unit,
    period,
    change,
    source,
    label: raw.label ?? raw?.period?.label
  };
}
function formatValue(stat) {
  if (!stat) return null;
  const { value, unit } = stat;
  if (!isNum(value)) return null;
  if (unit === "percent") return `${percentFormatter.format(value)}%`;
  if (unit === "gbp") return currencyFormatter.format(value);
  return percentFormatter.format(value);
}
function formatChange(change) {
  if (!change || !isNum(change.value)) return null;
  const u = change.unit;
  if (u === "percent") return `${percentFormatter.format(change.value)}%`;
  if (u === "percentagePoints") return `${percentFormatter.format(change.value)} pp`;
  if (u === "gbp") return currencyFormatter.format(change.value);
  return percentFormatter.format(change.value);
}
async function fetchJSON(url) {
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
var StatCard = ({ title: title2, icon: Icon, link, dataEndpoint, status, stat, error }) => {
  const formattedValue = status === "ready" ? formatValue(stat) : null;
  const formattedChange = status === "ready" ? formatChange(stat?.change) : null;
  const trend = stat?.change?.direction;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const trendColor = trend === "up" ? "text-red-600" : trend === "down" ? "text-green-600" : "text-gray-600";
  const updatedISO = stat?.period?.start || null;
  const updatedLabel = updatedISO ? formatMonthYearISO(updatedISO) : stat?.period?.label || null;
  let description2 = "";
  if (status === "ready") {
    description2 = stat?.description ?? stat?.period?.label ?? "";
  } else if (status === "loading") {
    description2 = "Fetching latest figures\u2026";
  } else if (status === "error") {
    description2 = error ?? "Unable to load data right now.";
  } else {
    description2 = "No data available right now.";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(Card, { className: "h-full flex flex-col", "aria-busy": status === "loading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(CardTitle, { className: "text-base font-medium", children: title2 }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Icon, { className: "w-5 h-5 text-gray-500", role: "img", "aria-label": title2 })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(CardContent, { className: "flex-grow flex flex-col justify-center min-h-[132px]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "text-3xl font-bold", "aria-live": "polite", children: [
        status === "ready" && formattedValue,
        status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "inline-block h-7 w-24 rounded bg-gray-100 animate-pulse" }),
        (status === "error" || status === "empty") && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "text-gray-400", children: "-" })
      ] }),
      status === "ready" && formattedChange && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "text-sm text-gray-600 flex items-center gap-1", children: [
        TrendIcon && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(TrendIcon, { className: `w-4 h-4 ${trendColor}` }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: trendColor, children: formattedChange }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { children: stat?.change?.label ?? "vs previous period" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: description2 }),
      status === "ready" && (updatedISO || updatedLabel) && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("p", { className: "text-[11px] text-gray-400 mt-2", children: [
        "Last updated:",
        " ",
        updatedISO ? /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("time", { dateTime: updatedISO, children: updatedLabel || formatMonthYearISO(updatedISO) || updatedISO }) : updatedLabel
      ] })
    ] }),
    link && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "p-4 pt-0 text-xs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
        "a",
        {
          href: link,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-1 text-blue-600 hover:underline",
          children: [
            "Source ",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(ExternalLink, { className: "w-3 h-3" })
          ]
        }
      ),
      dataEndpoint && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mt-1 text-xs", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
        "a",
        {
          href: dataEndpoint,
          className: "text-gray-500 hover:underline",
          "aria-label": `Download ${title2} as JSON`,
          children: "JSON"
        }
      ) })
    ] })
  ] });
};
function UKFinancialStats() {
  const [stats, setStats] = (0, import_react24.useState)(null);
  const [loading, setLoading] = (0, import_react24.useState)(true);
  const [errorBanner, setErrorBanner] = (0, import_react24.useState)(null);
  const [debug, setDebug] = (0, import_react24.useState)(false);
  const faqJsonLd = (0, import_react24.useMemo)(() => buildFaqJsonLd(statsFaqs), []);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const canonical3 = `${origin}/uk-financial-stats`;
  const datasetsJsonLd = (0, import_react24.useMemo)(() => {
    return buildDatasetsJsonLd({ origin, canonical: canonical3, stats });
  }, [origin, canonical3, stats]);
  (0, import_react24.useEffect)(() => {
    setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);
  (0, import_react24.useEffect)(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorBanner(null);
      const endpoints = {
        bankRate: "/api/boe/bank-rate",
        cpih: "/api/ons/cpih",
        housePrice: "/api/ukhpi/average-price",
        ofgemCap: "/api/ofgem/price-cap"
      };
      const results = {};
      const errors = {};
      await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          try {
            const raw = await fetchJSON(url);
            const norm = normalizeStat(raw);
            if (norm) results[key] = norm;
            else errors[key] = "Invalid data shape";
          } catch (e) {
            errors[key] = e.message || "Fetch failed";
          }
        })
      );
      if (!cancelled) {
        setStats(results);
        setErrorBanner(
          Object.values(errors).some(Boolean) ? "One or more sources are temporarily unavailable. Showing what we could fetch." : null
        );
        if (debug) {
          console.table(
            Object.entries(results).map(([k, v]) => ({
              id: k,
              value: v?.value,
              unit: v?.unit,
              period: v?.period?.label || v?.period?.start || ""
            }))
          );
          window.__ukStats = { results, errors };
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [debug]);
  const cards = (0, import_react24.useMemo)(() => {
    return STAT_CONFIG.map((cfg) => {
      const stat = stats?.[cfg.id];
      const ready = !!(stat && isNum(stat.value));
      const status = loading ? "loading" : ready ? "ready" : stats ? "empty" : "loading";
      return {
        ...cfg,
        stat: stat ? { ...stat, description: cfg.buildDescription(stat) } : null,
        status
      };
    });
  }, [stats, loading]);
  const lastUpdated = (0, import_react24.useMemo)(() => {
    if (!stats) return null;
    const pick = (s) => s?.period?.end || s?.period?.start || null;
    const toDate = (v) => {
      if (!v) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    };
    const times = Object.values(stats).map(pick).map(toDate).filter(Boolean).map((d) => d.getTime());
    if (!times.length) return null;
    return new Date(Math.max(...times));
  }, [stats]);
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      SeoHead,
      {
        title: "UK Financial Statistics (Live) | CalcMyMoney",
        desc: "Live UK Bank Rate, CPIH inflation, UK average house price and Ofgem energy price cap-pulled directly from official sources.",
        canonical: canonical3
      }
    ),
    datasetsJsonLd && datasetsJsonLd.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(JsonLd, { data: datasetsJsonLd }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(JsonLd, { data: faqJsonLd }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      JsonLd,
      {
        data: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "UK Financial Statistics \u2014 Methodology",
          description: "How CalcMyMoney fetches, normalises, and caches official UK statistics (Bank Rate, CPIH, UK HPI, Ofgem).",
          url: `${canonical3}#methodology`,
          dateModified: lastUpdated ? lastUpdated.toISOString() : void 0,
          publisher: { "@type": "Organization", name: "CalcMyMoney" },
          about: [
            { "@type": "DefinedTerm", name: "Bank Rate", url: "https://www.bankofengland.co.uk/" },
            { "@type": "DefinedTerm", name: "CPIH", url: "https://www.ons.gov.uk/" },
            { "@type": "DefinedTerm", name: "UK HPI", url: "https://landregistry.data.gov.uk/app/hpi/" },
            { "@type": "DefinedTerm", name: "Ofgem price cap", url: "https://www.ofgem.gov.uk/energy-price-cap" }
          ]
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
        Heading_default,
        {
          as: "h1",
          size: "h1",
          weight: "bold",
          className: "text-gray-900 dark:text-gray-100 mb-4",
          children: "UK Financial Statistics Dashboard"
        }
      ),
      lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "flex justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(Badge, { variant: "secondary", className: "text-xs", children: [
        "Last updated: ",
        lastUpdated.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Track key UK economic indicators. Data is sourced directly from official channels like the Bank of England and the Office for National Statistics." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      !loading && errorBanner && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mb-6 text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded-md p-3", children: errorBanner }),
      debug && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mb-6 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3", children: "Debug on. Open console for table. `window.__ukStats` has raw data." }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
        StatCard,
        {
          title: c.title,
          icon: c.icon,
          link: c.link,
          dataEndpoint: c.endpoint,
          status: c.status,
          stat: c.stat,
          error: errorBanner
        },
        c.id
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("section", { "aria-labelledby": "sources", className: "mt-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { id: "sources", className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Sources & downloads" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("ol", { className: "list-decimal pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
            "BoE Bank Rate \u2014",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
              "a",
              {
                href: "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp",
                target: "_blank",
                rel: "noopener",
                className: "text-blue-600 hover:underline",
                children: "official page"
              }
            ),
            " ",
            "\xB7",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("a", { href: "/api/boe/bank-rate", className: "text-gray-600 hover:underline", children: "JSON" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
            "CPIH (ONS) \u2014",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
              "a",
              {
                href: "https://www.ons.gov.uk/economy/inflationandpriceindices",
                target: "_blank",
                rel: "noopener",
                className: "text-blue-600 hover:underline",
                children: "official page"
              }
            ),
            " ",
            "\xB7",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("a", { href: "/api/ons/cpih", className: "text-gray-600 hover:underline", children: "JSON" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
            "UK House Price (UKHPI) \u2014",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
              "a",
              {
                href: "https://landregistry.data.gov.uk/app/hpi/",
                target: "_blank",
                rel: "noopener",
                className: "text-blue-600 hover:underline",
                children: "official page"
              }
            ),
            " ",
            "\xB7",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("a", { href: "/api/ukhpi/average-price", className: "text-gray-600 hover:underline", children: "JSON" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
            "Ofgem Price Cap \u2014",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
              "a",
              {
                href: "https://www.ofgem.gov.uk/energy-price-cap",
                target: "_blank",
                rel: "noopener",
                className: "text-blue-600 hover:underline",
                children: "official page"
              }
            ),
            " ",
            "\xB7",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("a", { href: "/api/ofgem/price-cap", className: "text-gray-600 hover:underline", children: "JSON" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mt-16", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
        RelatedCalculators,
        {
          calculators: [
            {
              name: "Mortgage Calculator",
              url: "/mortgage-calculator-uk",
              description: "Estimate repayments and see how Bank Rate scenarios change costs."
            },
            {
              name: "Mortgage Affordability Calculator",
              url: "/mortgage-affordability-calculator",
              description: "Model income, rates, and term to estimate what you can borrow."
            },
            {
              name: "Budget / Expense Calculator",
              url: "/budget-calculator",
              description: "Plan monthly spending and stress-test energy/price inflation."
            },
            {
              name: "Inflation Calculator",
              url: "/inflation-calculator",
              description: "See how purchasing power changes over time at different CPIH rates."
            },
            {
              name: "Energy Bill Calculator",
              url: "/energy-bill-calculator",
              description: "Estimate bills from unit rates and standing charges."
            }
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "mt-16", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6", children: "Financial stats: FAQs" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(FAQSection, { faqs: statsFaqs })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { id: "methodology", className: "mt-16", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "How we fetch & cache these stats" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(Accordion, { type: "single", collapsible: true, className: "w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionItem, { value: "sources", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccordionTrigger, { children: "Official sources & parsing" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionContent, { className: "text-sm leading-6 text-gray-700 dark:text-gray-300", children: [
              "We fetch directly from official sources:",
              /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("ul", { className: "list-disc pl-5 mt-2 space-y-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("strong", { children: "Bank Rate" }),
                  ": Bank of England JSON/CSV fallbacks."
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("strong", { children: "CPIH" }),
                  ": ONS time series endpoints with tolerant parsing."
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("strong", { children: "UK HPI" }),
                  ": HM Land Registry/ONS UK House Price Index."
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("li", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("strong", { children: "Ofgem cap" }),
                  ": Ofgem cap page (typical-use, unit rates)."
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionItem, { value: "normalization", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccordionTrigger, { children: "Normalization & units" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionContent, { className: "text-sm leading-6 text-gray-700 dark:text-gray-300", children: [
              "Each endpoint is normalized to a simple shape: ",
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("code", { children: "{ id, title, unit, value, period, change }" }),
              ". We sanity-check units (percent vs percentage points vs GBP) and coerce dates to ISO at the start of a period."
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionItem, { value: "caching", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccordionTrigger, { children: "Caching & freshness" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionContent, { className: "text-sm leading-6 text-gray-700 dark:text-gray-300", children: [
              "We set ",
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("code", { children: "Cache-Control" }),
              " headers (e.g., ",
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("code", { children: "s-maxage" }),
              ", ",
              /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("code", { children: "stale-while-revalidate" }),
              ") on API responses. The badge at the top shows the most recent period across all sources."
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(AccordionItem, { value: "limitations", children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccordionTrigger, { children: "Limitations" }),
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccordionContent, { className: "text-sm leading-6 text-gray-700 dark:text-gray-300", children: "Publishers may change page structures, release times, or data definitions. If a source is temporarily unavailable, we show partial results and a notice until the next refresh succeeds." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mt-12 text-center text-sm text-gray-500", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { children: "Disclaimer: Data shown here is for informational purposes only. Please consult the official sources linked in each card for the most current and accurate figures before making any financial decisions." }) })
    ] })
  ] });
}

// src/pages/Methodology.jsx
var import_react25 = __toESM(require_react(), 1);
var import_jsx_runtime34 = __toESM(require_jsx_runtime(), 1);
function Methodology() {
  const LAST_UPDATED_ISO = "2025-09-10";
  const LAST_UPDATED_DISPLAY = "10 September 2025";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Methodology", item: `${origin}/Methodology` }
    ]
  };
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(import_jsx_runtime34.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "bg-gray-50 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "Our Methodology & Data Sources" }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "How we calculate UK salary, tax and mortgage results. Data sources: HMRC 2025/26, Bank of England." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(CardContent, { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { children: "At Calculate My Money, accuracy and transparency are core principles. All of our calculators are built on official UK sources, and we update them as new figures are released. This page explains the rules we use, how frequently we refresh our data, and the assumptions behind our estimates." }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { className: "text-gray-700", children: "While our tools are carefully engineered, they are designed for guidance only and should not be relied upon as financial or legal advice. For personal advice, please consult a qualified professional, your employer, or your lender." })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardTitle, { children: "Tax Year & Thresholds" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardContent, { className: "p-6 space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "Current default:" }),
              " 2025/26 UK tax year"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "Data source:" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                "a",
                {
                  href: "https://www.gov.uk/guidance/rates-and-allowances-for-income-tax",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-blue-600 hover:underline",
                  children: "HMRC Income Tax Rates and Allowances"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "Regional support:" }),
              " calculators reflect both rUK and Scottish tax bands"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "National Insurance:" }),
              " thresholds and rates from",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                "a",
                {
                  href: "https://www.gov.uk/national-insurance-rates-letters",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-blue-600 hover:underline",
                  children: "HMRC National Insurance Rates"
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardTitle, { children: "Pension & Student Loans" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardContent, { className: "p-6 space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "Pension contributions: calculated on either a relief-at-source or net pay basis (depending on input)." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "Student loans: Plan 1, Plan 2, Plan 4, and Postgraduate Loans supported." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              "Thresholds from",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                "a",
                {
                  href: "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-blue-600 hover:underline",
                  children: "HMRC Student Loan Repayment"
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardTitle, { children: "Mortgage & Interest Rates" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardContent, { className: "p-6 space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "Mortgage calculators allow flexible entry of rate, deposit, and term." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "We recommend cross-checking with current lender offers." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
              "Reference:",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                "a",
                {
                  href: "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-blue-600 hover:underline",
                  children: "Bank of England Base Rate"
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardTitle, { children: "Assumptions & Rounding" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardContent, { className: "p-6 space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "Results rounded to the nearest \xA31 for clarity." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "Annual to monthly/weekly conversions use standard 12-month or 52-week assumptions." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("li", { children: "PAYE applied cumulatively across the tax year." })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CardTitle, { children: "Updates & Maintenance" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(CardContent, { className: "p-6 space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { children: "Figures updated within 1 week of official HMRC or BoE releases." }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("p", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "Last updated:" }),
              " ",
              LAST_UPDATED_DISPLAY
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("p", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("strong", { children: "Maintained by:" }),
              " Calculate My Money Team"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/About.jsx
var import_react26 = __toESM(require_react(), 1);
var import_jsx_runtime35 = __toESM(require_jsx_runtime(), 1);
function About() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${origin}/About` }
    ]
  };
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "bg-background", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "bg-hero border-b border-border/60", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", underline: true, className: "text-hero-foreground", children: "About Calculate My Money" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "lead text-muted-foreground max-w-3xl mx-auto mt-3", children: "Who we are and how we build accurate, transparent UK financial calculators." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-muted-foreground", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardTitle, { className: "heading-3 text-card-foreground", children: "Mission" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Our mission is simple: to make UK money calculations clear, accurate, and accessible for everyone. Whether you\u2019re checking your take-home pay, planning a mortgage, or projecting savings, we want you to have fast, reliable tools that reflect the latest rules." }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardTitle, { className: "heading-3 text-card-foreground", children: "Who We Are" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "We are a team of financial experts and IT specialists who are passionate about building transparent, trustworthy, and user-friendly tools. Each calculator is designed with a balance of financial expertise and technical precision to ensure accuracy, clarity, and ease of use." }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardTitle, { className: "heading-3 text-card-foreground", children: "Our Approach" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("ul", { className: "list-disc list-inside space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("strong", { children: "Accuracy first" }),
              " \u2013 always based on HMRC and Bank of England sources"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("strong", { children: "Regular updates" }),
              " \u2013 new thresholds integrated promptly"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("strong", { children: "Transparency" }),
              " \u2013 clear assumptions and disclaimers on every calculator"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("strong", { children: "Accessibility" }),
              " \u2013 free and mobile-friendly for everyone in the UK"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CardTitle, { className: "heading-3 text-card-foreground", children: "Contact" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "For questions, corrections, or feedback, please email:" }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { className: "mt-2", children: [
              "\u{1F4E7}",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                "a",
                {
                  href: "mailto:support@calcmymoney.co.uk",
                  className: "text-primary hover:underline",
                  children: "support@calcmymoney.co.uk"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/SelfAssessmentGuide.jsx
var import_react27 = __toESM(require_react(), 1);
var import_jsx_runtime36 = __toESM(require_jsx_runtime(), 1);
function SelfAssessmentGuide() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tax Calculators Hub",
        item: `${origin}/TaxCalculatorsUK`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Self Assessment Guide",
        item: `${origin}/SelfAssessmentGuide`
      }
    ]
  };
  const faqs = [
    {
      question: "Who needs to do Self Assessment?",
      answer: "Self-employed individuals and those with untaxed income often need to file. Check GOV.UK for specifics."
    },
    {
      question: "When are the deadlines?",
      answer: "31 October (paper returns) and 31 January (online) following the end of the tax year."
    }
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("script", { type: "application/ld+json", children: JSON.stringify(faqJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-gray-50 border-b border-gray-200 text-center py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "UK Self Assessment Guide" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-gray-600 mt-2", children: "Deadlines, rates, allowances and tips for 2025/26." }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Link,
            {
              to: createPageUrl("TaxCalculatorsUK"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax Hub"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Link,
            {
              to: createPageUrl("NetIncomeUKCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Net Income"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Link,
            {
              to: createPageUrl("TaxAndNICalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax + NI"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-gray-700", children: "A practical overview of Self Assessment. We recommend reading official HMRC guidance for full details before filing." }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("ul", { className: "list-disc list-inside text-gray-700 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("li", { children: "Check if you need to file" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("li", { children: "Register with HMRC in time" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("li", { children: "Keep accurate records and receipts" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("li", { children: "File before the deadline and pay any tax due" })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/LinkToUs.jsx
var import_react28 = __toESM(require_react(), 1);
var import_jsx_runtime37 = __toESM(require_jsx_runtime(), 1);
var canonical2 = "/link-to-us";
function LinkToUs() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calcmymoney.co.uk/" },
      { "@type": "ListItem", position: 2, name: "Resources", item: "https://www.calcmymoney.co.uk/resources" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Embed Our Calculators",
        item: "https://www.calcmymoney.co.uk/link-to-us"
      }
    ]
  };
  const salaryIframe = `<iframe
  src="https://www.calcmymoney.co.uk/salary-calculator-uk?embed=1"
  width="100%" height="260" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="UK Salary (Take-Home) Calculator"></iframe>
<p style="font-size:12px;color:#6b7280">Powered by <a href="https://www.calcmymoney.co.uk/salary-calculator-uk" rel="noopener">CalcMyMoney</a></p>`;
  const mortgageIframe = `<iframe
  src="https://www.calcmymoney.co.uk/mortgage-calculator-uk?embed=1"
  width="100%" height="320" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="Mortgage Repayment Calculator"></iframe>
<p style="font-size:12px;color:#6b7280">Powered by <a href="https://www.calcmymoney.co.uk/mortgage-calculator-uk" rel="noopener">CalcMyMoney</a></p>`;
  const capIframe = `<iframe
  src="https://www.calcmymoney.co.uk/uk-financial-stats?embed=cap"
  width="100%" height="180" style="border:1px solid #e5e7eb;border-radius:12px"
  loading="lazy" title="Ofgem Energy Price Cap (typical)"></iframe>
<p style="font-size:12px;color:#6b7280">Powered by <a href="https://www.calcmymoney.co.uk/uk-financial-stats" rel="noopener">CalcMyMoney</a></p>`;
  const scriptEmbed = `<!-- Beta: small, non\u2011blocking salary tile -->
<div id="cmm-salary-tile" data-salary="50000"></div>
<script async defer src="https://www.calcmymoney.co.uk/embed/salary-tile.js"><\/script>`;
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      SeoHead,
      {
        title: "Embed Our Calculators | CalcMyMoney",
        desc: "Free, embeddable UK salary, mortgage and energy cap widgets with live data.",
        canonical: canonical2
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(JsonLd, { data: breadcrumb }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-2", children: "Embed Our UK Money Calculators" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto", children: "Fast, free and kept up\u2011to\u2011date with the latest UK tax rules and official data. Copy a snippet below to embed a calculator on your website in minutes." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("main", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Salary (Take\u2011Home) \u2014 iframe embed" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "A compact take\u2011home calculator ideal for job ads, career pages or finance guides." }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("pre", { className: "text-sm text-gray-800 dark:text-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("code", { children: salaryIframe }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Mortgage Payment \u2014 iframe embed" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Great for property pages and remortgage guides." }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("pre", { className: "text-sm text-gray-800 dark:text-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("code", { children: mortgageIframe }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "Energy Price Cap badge \u2014 iframe embed" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Shows the current Ofgem typical\u2011use cap." }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("pre", { className: "text-sm text-gray-800 dark:text-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("code", { children: capIframe }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { className: "text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100", children: "(Beta) Script embed \u2014 salary tile" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Non\u2011blocking script renders a small salary tile. Safe on HTTPS pages and mobile\u2011friendly." }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("pre", { className: "text-sm text-gray-800 dark:text-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("code", { children: scriptEmbed }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("p", { className: "text-gray-700 dark:text-gray-300", children: [
          "For context and live figures, see our",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/uk-financial-stats", className: "text-blue-600 hover:underline", children: "UK Financial Stats" }),
          " ",
          "hub. Popular calculators: ",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/salary-calculator-uk", className: "text-blue-600 hover:underline", children: "Salary" }),
          ",",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/paye-calculator", className: "text-blue-600 hover:underline", children: "PAYE" }),
          ",",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/mortgage-calculator-uk", className: "text-blue-600 hover:underline", children: "Mortgage" }),
          ",",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/budget-calculator", className: "text-blue-600 hover:underline", children: "Budget" }),
          "."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
          "Attribution: Please include a visible link to",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "https://www.calcmymoney.co.uk/", className: "text-blue-600 hover:underline", rel: "noopener", children: "CalcMyMoney" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("section", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h3", { className: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100", children: "Technical notes" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("ul", { className: "list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("li", { children: "HTTPS sites only; mobile responsive iframes." }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("li", { children: "No cookies or tracking; embeds are read\u2011only." }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("li", { children: [
            "Use ",
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("code", { children: "?embed=1" }),
            " to load compact layouts where available."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("li", { children: [
            "Questions? ",
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("a", { href: "/contact", className: "text-blue-600 hover:underline", children: "Contact us" }),
            " \u2014 we\u2019re happy to help."
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/index.jsx
var import_jsx_runtime38 = __toESM(require_jsx_runtime(), 1);
var LEGACY_REDIRECTS = {
  "/AnnuityCalculator": "/annuity-calculator",
  "/ProRataSalaryCalculator": "/pro-rata-salary-calculator",
  "/overtimepaycalculator": "/overtime-pay-calculator",
  "/salary-calculator-u-k": "/salary-calculator-uk",
  "/mortgage-calculator-u-k": "/mortgage-calculator-uk",
  "/tax-calculators-u-k": "/tax-calculators-uk"
};
var COST_OF_LIVING_BASE_PATH2 = createPageUrl2("CostOfLiving");
var LazySalaryCalculatorUK = (0, import_react29.lazy)(() => import("./SalaryCalculatorUK-GAEAQYI4.js"));
var LazyMortgageCalculator = (0, import_react29.lazy)(() => import("./MortgageCalculator-DASJZKGY.js"));
var LazyRentalIncomeCalculator = (0, import_react29.lazy)(() => import("./RentalIncomeCalculator-JBTMDZGS.js"));
var LazyRentalYieldCalculator = (0, import_react29.lazy)(() => import("./RentalYieldCalculator-Q7M3XCOC.js"));
var LazyBRRRRCalculator = (0, import_react29.lazy)(() => import("./BRRRRCalculator-ELMG226C.js"));
var LazyDebtCalculator = (0, import_react29.lazy)(() => import("./DebtCalculator-KMTLD6G7.js"));
var LazyFIRECalculator = (0, import_react29.lazy)(() => import("./FIRECalculator-XOA2BAMX.js"));
var LazyBudgetCalculator = (0, import_react29.lazy)(() => import("./BudgetCalculator-7BKETLBI.js"));
var LazyIncomeTaxCalculator = (0, import_react29.lazy)(() => import("./IncomeTaxCalculator-VK7I6Y7S.js"));
var LazyNationalInsuranceCalculator = (0, import_react29.lazy)(() => import("./NationalInsuranceCalculator-CV4LWXTD.js"));
var LazyCompoundInterestCalculator = (0, import_react29.lazy)(() => import("./CompoundInterestCalculator-KOFZFDJW.js"));
var LazyStudentLoanCalculator = (0, import_react29.lazy)(() => import("./StudentLoanCalculator-CR2NJ7GS.js"));
var LazySavingsGoalCalculator = (0, import_react29.lazy)(() => import("./SavingsGoalCalculator-P2GCXMLC.js"));
var LazyPensionCalculator = (0, import_react29.lazy)(() => import("./PensionCalculator-7Q2OMUWB.js"));
var LazyMaternityPayCalculator = (0, import_react29.lazy)(() => import("./MaternityPayCalculator-LSRPU2YR.js"));
var LazyStatutorySickPayCalculator = (0, import_react29.lazy)(() => import("./StatutorySickPayCalculator-6Y6CLYEJ.js"));
var LazyEmergencyFundCalculator = (0, import_react29.lazy)(() => import("./EmergencyFundCalculator-SC7WBBJH.js"));
var LazySalarySacrificeCalculator = (0, import_react29.lazy)(() => import("./SalarySacrificeCalculator-MSSJYID3.js"));
var LazyHolidayPayCalculator = (0, import_react29.lazy)(() => import("./HolidayPayCalculator-65VP5VWE.js"));
var LazyInflationCalculator = (0, import_react29.lazy)(() => import("./InflationCalculator-G7PN563U.js"));
var LazyDreamLifestyleCalculator = (0, import_react29.lazy)(() => import("./DreamLifestyleCalculator-WANC7CVP.js"));
var LazyRedundancyPayCalculator = (0, import_react29.lazy)(() => import("./RedundancyPayCalculator-ZDYFURCD.js"));
var LazyMinimumWageCalculator = (0, import_react29.lazy)(() => import("./MinimumWageCalculator-7CY75LXY.js"));
var LazyOvertimeBonusCalculator = (0, import_react29.lazy)(() => import("./OvertimeBonusCalculator-Z3E2ZBAM.js"));
var LazyHourlyToAnnualSalaryCalculator = (0, import_react29.lazy)(
  () => import("./HourlyToAnnualSalaryCalculator-P2VC7DGX.js")
);
var LazyContractorCalculator = (0, import_react29.lazy)(() => import("./ContractorCalculator-4WZA7MGG.js"));
var LazyNetWorthCalculator = (0, import_react29.lazy)(() => import("./NetWorthCalculator-JMNBPFEJ.js"));
var LazyEnergyBillCalculator = (0, import_react29.lazy)(() => import("./EnergyBillCalculator-F6PBK4EW.js"));
var LazyPAYECalculator = (0, import_react29.lazy)(() => import("./PAYECalculator-CSFZCEQE.js"));
var LazyVATCalculator = (0, import_react29.lazy)(() => import("./VATCalculator-4DF52BXJ.js"));
var LazyMortgageAffordabilityCalculator = (0, import_react29.lazy)(
  () => import("./MortgageAffordabilityCalculator-UF2TKGRU.js")
);
var LazyProRataSalaryCalculator = (0, import_react29.lazy)(() => import("./ProRataSalaryCalculator-C5LJVWGV.js"));
var LazyISACalculator = (0, import_react29.lazy)(() => import("./ISACalculator-O4MYD3VE.js"));
var LazyCapitalGainsTaxCalculator = (0, import_react29.lazy)(() => import("./CapitalGainsTaxCalculator-V56JJMLE.js"));
var LazyLoanRepaymentCalculator = (0, import_react29.lazy)(() => import("./LoanRepaymentCalculator-ATQWJSIQ.js"));
var LazyCorporationTaxCalculator = (0, import_react29.lazy)(() => import("./CorporationTaxCalculator-BASE4CAP.js"));
var LazyStampDutyCalculator = (0, import_react29.lazy)(() => import("./StampDutyCalculator-6NKHZGB3.js"));
var LazyFreelancerDayRateCalculator = (0, import_react29.lazy)(() => import("./FreelancerDayRateCalculator-IUZJDINP.js"));
var LazyPensionContributionCalculator = (0, import_react29.lazy)(() => import("./PensionContributionCalculator-WEMKNJR2.js"));
var LazyBusinessLoanCalculator = (0, import_react29.lazy)(() => import("./BusinessLoanCalculator-CQO3FVD7.js"));
var LazyBreakEvenCalculator = (0, import_react29.lazy)(() => import("./BreakEvenCalculator-LGMNNKOK.js"));
var LazyCarLoanCalculator = (0, import_react29.lazy)(() => import("./CarLoanCalculator-TFRJ2V3E.js"));
var LazyDebtToIncomeRatioCalculator = (0, import_react29.lazy)(() => import("./DebtToIncomeRatioCalculator-BKK32S27.js"));
var LazyBuyToLetMortgageCalculator = (0, import_react29.lazy)(() => import("./BuyToLetMortgageCalculator-KXAE7WXN.js"));
var LazyRemortgageCalculator = (0, import_react29.lazy)(() => import("./RemortgageCalculator-I5SGMHYB.js"));
var LazyInvestmentCalculator = (0, import_react29.lazy)(() => import("./InvestmentCalculator-3RC54M6A.js"));
var LazyPersonalLoanCalculator = (0, import_react29.lazy)(() => import("./PersonalLoanCalculator-K745IZ73.js"));
var LazyCreditCardRepaymentCalculator = (0, import_react29.lazy)(() => import("./CreditCardRepaymentCalculator-GIKP2EPH.js"));
var LazyRetirementSavingsCalculator = (0, import_react29.lazy)(() => import("./RetirementSavingsCalculator-R4FBP4DB.js"));
var LazyPayrollCalculator = (0, import_react29.lazy)(() => import("./PayrollCalculator-QYVK5TQT.js"));
var LazyAmortizationCalculator = (0, import_react29.lazy)(() => import("./AmortizationCalculator-G3H24EQZ.js"));
var LazyAnnuityCalculator = (0, import_react29.lazy)(() => import("./AnnuityCalculator-AQGYUM3G.js"));
var LazySimpleInterestCalculator = (0, import_react29.lazy)(() => import("./SimpleInterestCalculator-I7T4H5EY.js"));
var LazySalaryIncreaseCalculator = (0, import_react29.lazy)(() => import("./SalaryIncreaseCalculator-MZ2WVOLV.js"));
var LazyEffectiveTaxRateCalculator = (0, import_react29.lazy)(() => import("./EffectiveTaxRateCalculator-W2AV6RJA.js"));
var LazyHomeEquityLoanCalculator = (0, import_react29.lazy)(() => import("./HomeEquityLoanCalculator-TXV4K2TF.js"));
var LazyCommissionCalculator = (0, import_react29.lazy)(() => import("./CommissionCalculator-2HV2QWE3.js"));
var LazyDividendTaxCalculator = (0, import_react29.lazy)(() => import("./DividendTaxCalculator-B4NTBNGB.js"));
var LazyFutureValueCalculator = (0, import_react29.lazy)(() => import("./FutureValueCalculator-RII245K5.js"));
var LazyOvertimePayCalculator = (0, import_react29.lazy)(() => import("./OvertimePayCalculator-RBLLQIOO.js"));
var LazyLoanComparisonCalculator = (0, import_react29.lazy)(() => import("./LoanComparisonCalculator-2Q4NAID6.js"));
var LazyInheritanceTaxCalculator = (0, import_react29.lazy)(() => import("./InheritanceTaxCalculator-DUXA4IHG.js"));
var LazyCouncilTaxCalculator = (0, import_react29.lazy)(() => import("./CouncilTaxCalculator-M2ZJ64V7.js"));
var LazyMortgageRepaymentCalculator = (0, import_react29.lazy)(() => import("./MortgageRepaymentCalculator-GM6JJ5JG.js"));
var LazyFirstTimeBuyerCalculator = (0, import_react29.lazy)(() => import("./FirstTimeBuyerCalculator-PNJFCO33.js"));
var LazyRentVsBuyCalculator = (0, import_react29.lazy)(() => import("./RentVsBuyCalculator-7IWB2A2L.js"));
var LazyHouseholdBillsSplitter = (0, import_react29.lazy)(() => import("./HouseholdBillsSplitter-CBI6UQOV.js"));
var LazyCommuteCostCalculator = (0, import_react29.lazy)(() => import("./CommuteCostCalculator-LPO3SV3U.js"));
var LazyCarCostCalculator = (0, import_react29.lazy)(() => import("./CarCostCalculator-D65WO2IH.js"));
var LazySubscriptionCostCalculator = (0, import_react29.lazy)(() => import("./SubscriptionCostCalculator-EZ7ATKIS.js"));
var LazyRuleOf72Calculator = (0, import_react29.lazy)(() => import("./RuleOf72Calculator-IW6UVOQR.js"));
var LazyStudentLoanRepaymentCalculator = (0, import_react29.lazy)(
  () => import("./StudentLoanRepaymentCalculator-QZO3VO5U.js")
);
var LazyWeddingBudgetCalculator = (0, import_react29.lazy)(() => import("./WeddingBudgetCalculator-F2FMH5Q7.js"));
var LazyTravelBudgetCalculator = (0, import_react29.lazy)(() => import("./TravelBudgetCalculator-ACCRIUVA.js"));
var LazyChildcareCostCalculator = (0, import_react29.lazy)(() => import("./ChildcareCostCalculator-TJSAE54P.js"));
var LazyTipCalculator = (0, import_react29.lazy)(() => import("./TipCalculator-NGT74X4Q.js"));
var LazyOvertimeRateCalculator = (0, import_react29.lazy)(() => import("./OvertimeRateCalculator-Y2C3N5RE.js"));
var LazyCurrencyConverter = (0, import_react29.lazy)(() => import("./CurrencyConverter-O5XJ5HVC.js"));
var LazySalaryCalculatorTakeHomePay = (0, import_react29.lazy)(() => import("./SalaryCalculatorTakeHomePay-P4EDOGRE.js"));
var LazySalaryCalculatorPaycheck = (0, import_react29.lazy)(() => import("./SalaryCalculatorPaycheck-OQBDBF6K.js"));
var LazyGrossToNetCalculator = (0, import_react29.lazy)(() => import("./GrossToNetCalculator-5S6YT23E.js"));
var LazyTaxCalculatorsUK = (0, import_react29.lazy)(() => import("./TaxCalculatorsUK-MTOXFIQH.js"));
var LazyTaxAfterTaxCalculator = (0, import_react29.lazy)(() => import("./TaxAfterTaxCalculator-L65PPLG7.js"));
var LazyTaxAndNICalculator = (0, import_react29.lazy)(() => import("./TaxAndNICalculator-AV5IVOLZ.js"));
var LazyNetIncomeUKCalculator = (0, import_react29.lazy)(() => import("./NetIncomeUKCalculator-RYH64T7U.js"));
var LazyMortgageCalculatorUK = (0, import_react29.lazy)(() => import("./MortgageCalculatorUK-TGMZP5IH.js"));
var LazyMortgageLoanRepayment = (0, import_react29.lazy)(() => import("./MortgageLoanRepayment-LUOYBAYK.js"));
var LazyHomeLoanMortgageCalculator = (0, import_react29.lazy)(() => import("./HomeLoanMortgageCalculator-DTKQCET7.js"));
var LazyMortgageComparison = (0, import_react29.lazy)(() => import("./MortgageComparison-4NQSDMON.js"));
var PAGES = {
  Home,
  PrivacyPolicy,
  CookiePolicy,
  Contact,
  Resources,
  Blog,
  Sitemap,
  JobSalaries,
  CostOfLiving,
  UKGovernmentBudget,
  TermsOfService,
  Disclaimer,
  BlogSmartMoneySavingTips,
  BlogDebtRepaymentStrategies,
  BlogFinancialPsychology,
  JobSalaryPage,
  CostOfLivingPage,
  UKFinancialStats,
  Methodology,
  About,
  SelfAssessmentGuide,
  LinkToUs
};
var _allCalcs = calculatorCategories.flatMap(
  (cat) => (cat?.subCategories || []).flatMap((sub) => sub?.calculators || [])
);
var pageModules = import.meta.glob("./*.jsx");
var _loadPage = (pageName) => {
  if (!pageName) return null;
  const key = `./${pageName}.jsx`;
  const loader = pageModules[key];
  return loader ? (0, import_react29.lazy)(loader) : null;
};
var DYNAMIC_CALC_ROUTES = _allCalcs.filter((c) => c?.status === "active" && typeof c.page === "string" && c.page.trim()).map((c) => {
  const C = _loadPage(c.page);
  return C ? { path: c.url, Component: C, name: c.name } : null;
}).filter(Boolean);
var _normalizeSlug = (value = "") => {
  if (typeof value !== "string") return "";
  const [path] = value.split("?");
  const [cleanPath] = path.split("#");
  return cleanPath.replace(/^\/+|\/+$/g, "").toLowerCase();
};
var _registerSlug = (map, slug, pageName) => {
  if (!pageName || typeof pageName !== "string") return;
  const normalized = _normalizeSlug(slug);
  if (normalized === void 0) return;
  if (!map.has(normalized)) {
    map.set(normalized, pageName);
  }
};
var _slugToPageName = (() => {
  const map = /* @__PURE__ */ new Map();
  const registerPageKey = (pageKey) => {
    _registerSlug(map, createPageUrl2(pageKey), pageKey);
  };
  _registerSlug(map, "/", "Home");
  _registerSlug(map, "home", "Home");
  Object.keys(PAGES).forEach(registerPageKey);
  Object.keys(pageSeo || {}).forEach(registerPageKey);
  _allCalcs.forEach((calc) => {
    if (!calc) return;
    if (calc.url) {
      const target = typeof calc.page === "string" && calc.page.trim() || void 0;
      _registerSlug(map, calc.url, target);
    }
    if (typeof calc?.page === "string" && calc.page.trim()) {
      _registerSlug(map, createPageUrl2(calc.page), calc.page.trim());
    }
  });
  const costOfLivingBase = COST_OF_LIVING_BASE_PATH2.replace(/^\/+|\/+$/g, "");
  if (costOfLivingBase) {
    ukCities.forEach((city) => {
      if (!city?.name) return;
      const slug = createSlug(city.name);
      if (!slug) return;
      _registerSlug(map, `${costOfLivingBase}/${slug}`, "CostOfLivingPage");
    });
  }
  return map;
})();
function LegacyCostOfLivingRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search || "");
  const slug = params.get("slug");
  const normalizedSlug = slug ? createSlug(slug) : "";
  if (normalizedSlug) {
    return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Navigate, { to: `${COST_OF_LIVING_BASE_PATH2}/${normalizedSlug}`, replace: true });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Navigate, { to: COST_OF_LIVING_BASE_PATH2, replace: true });
}
function _getCurrentPage(pathname) {
  const normalizedPath = _normalizeSlug(pathname || "/");
  if (!normalizedPath || normalizedPath === "home") {
    return "Home";
  }
  if (normalizedPath.startsWith("cost-of-living/")) {
    return "CostOfLivingPage";
  }
  const segments = normalizedPath.split("/").filter(Boolean);
  const candidateSlugs = /* @__PURE__ */ new Set([normalizedPath]);
  if (segments.length > 0) {
    candidateSlugs.add(segments[segments.length - 1]);
    let running = "";
    segments.forEach((segment) => {
      running = running ? `${running}/${segment}` : segment;
      if (running !== normalizedPath) {
        candidateSlugs.add(running);
      }
    });
  }
  for (const slug of candidateSlugs) {
    const match = _slugToPageName.get(slug);
    if (match) return match;
  }
  return "LazyRoute";
}
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Layout, { currentPageName: currentPage, children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
    import_react29.Suspense,
    {
      fallback: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "p-10 text-center text-lg text-indigo-600", children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full mr-2" }),
        "Loading Calculator Page..."
      ] }),
      children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(Routes, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Home, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/home", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Home, {}) }),
        DYNAMIC_CALC_ROUTES.map(({ path, Component }) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path, element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Component, {}) }, `dyn:${path}`)),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/budget-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyBudgetCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/debt-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyDebtCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/mortgage-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/mortgage-affordability-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageAffordabilityCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/mortgage-calculator-uk", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageCalculatorUK, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/mortgage-loan-repayment", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageLoanRepayment, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/home-loan-mortgage-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyHomeLoanMortgageCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/mortgage-comparison", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageComparison, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/compound-interest-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCompoundInterestCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/savings-goal-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySavingsGoalCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/pension-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyPensionCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/emergency-fund-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyEmergencyFundCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/inflation-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyInflationCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/dream-lifestyle-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyDreamLifestyleCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/minimum-wage-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMinimumWageCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/hourly-to-annual-salary-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyHourlyToAnnualSalaryCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/fire-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyFIRECalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/net-worth-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyNetWorthCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/energy-bill-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyEnergyBillCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/rental-income-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRentalIncomeCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/rental-yield-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRentalYieldCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/brrrr-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyBRRRRCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/contractor-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyContractorCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/salary-calculator-take-home-pay",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySalaryCalculatorTakeHomePay, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/salary-calculator-paycheck",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySalaryCalculatorPaycheck, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/gross-to-net-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyGrossToNetCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/pro-rata-salary-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyProRataSalaryCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/loan-repayment-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyLoanRepaymentCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/freelancer-day-rate-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyFreelancerDayRateCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/pension-contribution-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyPensionContributionCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/business-loan-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyBusinessLoanCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/break-even-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyBreakEvenCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/car-loan-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCarLoanCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/debt-to-income-ratio-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyDebtToIncomeRatioCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/buy-to-let-mortgage-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyBuyToLetMortgageCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/remortgage-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRemortgageCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/investment-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyInvestmentCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/personal-loan-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyPersonalLoanCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/credit-card-repayment-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCreditCardRepaymentCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/retirement-savings-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRetirementSavingsCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/amortization-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyAmortizationCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/annuity-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyAnnuityCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/simple-interest-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySimpleInterestCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/salary-increase-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySalaryIncreaseCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/effective-tax-rate-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyEffectiveTaxRateCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/home-equity-loan-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyHomeEquityLoanCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/commission-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCommissionCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/dividend-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyDividendTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/future-value-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyFutureValueCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/overtime-pay-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyOvertimePayCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/loan-comparison-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyLoanComparisonCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/mortgage-repayment-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMortgageRepaymentCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/first-time-buyer-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyFirstTimeBuyerCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/rent-vs-buy-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRentVsBuyCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/household-bills-splitter", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyHouseholdBillsSplitter, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/commute-cost-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCommuteCostCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/car-cost-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCarCostCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/subscription-cost-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySubscriptionCostCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/rule-of-72-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRuleOf72Calculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/student-loan-repayment-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyStudentLoanRepaymentCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/wedding-budget-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyWeddingBudgetCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/travel-budget-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyTravelBudgetCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/childcare-cost-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyChildcareCostCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/tip-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyTipCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/overtime-rate-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyOvertimeRateCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/currency-converter", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCurrencyConverter, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/income-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyIncomeTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/national-insurance-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyNationalInsuranceCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/tax-calculators-uk", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyTaxCalculatorsUK, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/tax-after-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyTaxAfterTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/tax-and-ni-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyTaxAndNICalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/net-income-uk-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyNetIncomeUKCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/student-loan-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyStudentLoanCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/maternity-pay-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyMaternityPayCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          Route,
          {
            path: "/statutory-sick-pay-calculator",
            element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyStatutorySickPayCalculator, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/salary-sacrifice-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySalarySacrificeCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/holiday-pay-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyHolidayPayCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/redundancy-pay-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyRedundancyPayCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/overtime-bonus-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyOvertimeBonusCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/paye-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyPAYECalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/vat-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyVATCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/isa-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyISACalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/capital-gains-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCapitalGainsTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/corporation-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCorporationTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/stamp-duty-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyStampDutyCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/payroll-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyPayrollCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/inheritance-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyInheritanceTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/council-tax-calculator", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazyCouncilTaxCalculator, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/salary-calculator-uk", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LazySalaryCalculatorUK, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/job-salaries", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(JobSalaries, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/job-salaries/:slug", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(JobSalaryPage, {}) }),
        Object.entries(LEGACY_REDIRECTS).map(([from, to]) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: from, element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Navigate, { to, replace: true }) }, `legacy:${from}`)),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/privacy-policy", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(PrivacyPolicy, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/cookie-policy", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(CookiePolicy, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/contact", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Contact, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/resources", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Resources, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/blog", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Blog, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/sitemap", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Sitemap, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/cost-of-living", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(CostOfLiving, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/cost-of-living/:slug", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(CostOfLivingPage, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/uk-government-budget", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(UKGovernmentBudget, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/terms-of-service", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(TermsOfService, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/disclaimer", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Disclaimer, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/blog-smart-money-saving-tips", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BlogSmartMoneySavingTips, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/blog-debt-repayment-strategies", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BlogDebtRepaymentStrategies, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/blog-financial-psychology", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BlogFinancialPsychology, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/blog/why-small-calculations-matter", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BlogWhyCalculationsMatter, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/job-salary-page", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(JobSalaryPage, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/jobsalarypage", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(JobSalaryPage, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/cost-of-living-page", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LegacyCostOfLivingRedirect, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/uk-financial-stats", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(UKFinancialStats, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/methodology", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Methodology, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/about", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(About, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/self-assessment-guide", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(SelfAssessmentGuide, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "/link-to-us", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(LinkToUs, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Route, { path: "*", element: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(NotFound, {}) })
      ] })
    }
  ) });
}
function Pages() {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BrowserRouter, { children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(PagesContent, {}) });
}

// src/components/ui/use-toast.jsx
var import_react30 = __toESM(require_react(), 1);
var TOAST_LIMIT = 20;
var TOAST_REMOVE_DELAY = 1e6;
var actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
};
var count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map();
var addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
var reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      };
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
var listeners = [];
var memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = (0, import_react30.useState)(memoryState);
  (0, import_react30.useEffect)(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  };
}

// src/components/ui/toast.jsx
var React38 = __toESM(require_react(), 1);
var import_jsx_runtime39 = __toESM(require_jsx_runtime(), 1);
var ToastProvider = React38.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
  "div",
  {
    ref,
    className: "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
    ...props
  }
));
ToastProvider.displayName = "ToastProvider";
var ToastViewport = React38.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
  "div",
  {
    ref,
    className: "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
    ...props
  }
));
ToastViewport.displayName = "ToastViewport";
var toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Toast = React38.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { ref, className: cn(toastVariants({ variant }), className), ...props });
});
Toast.displayName = "Toast";
var ToastAction = React38.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
  "div",
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = "ToastAction";
var ToastClose = React38.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
  "button",
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = "ToastClose";
var ToastTitle = React38.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { ref, className: cn("text-sm font-semibold", className), ...props }));
ToastTitle.displayName = "ToastTitle";
var ToastDescription = React38.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = "ToastDescription";

// src/components/ui/toaster.jsx
var import_jsx_runtime40 = __toESM(require_jsx_runtime(), 1);
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(ToastProvider, { children: [
    toasts.map(function({ id, title: title2, description: description2, action, ...props }) {
      return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(Toast, { ...props, children: [
        /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "grid gap-1", children: [
          title2 && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(ToastTitle, { children: title2 }),
          description2 && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(ToastDescription, { children: description2 })
        ] }),
        action,
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(ToastViewport, {})
  ] });
}

// src/App.jsx
var import_jsx_runtime41 = __toESM(require_jsx_runtime(), 1);
function App() {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(HelmetProvider, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(Pages, {}),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(Toaster, {})
  ] });
}
var App_default = App;

// src/main.jsx
var import_jsx_runtime42 = __toESM(require_jsx_runtime(), 1);
import_client.default.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_react31.default.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(HelmetProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(App_default, {}) }) })
);
