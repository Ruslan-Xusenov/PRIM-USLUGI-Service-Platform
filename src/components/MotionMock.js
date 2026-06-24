'use client';

export const LazyMotion = ({ children }) => <>{children}</>;
export const AnimatePresence = ({ children }) => <>{children}</>;

const createMotionComponent = (Tag) => {
  return function MotionComponent({ children, style, className, ...props }) {
    const cleanProps = { ...props };
    delete cleanProps.variants;
    delete cleanProps.initial;
    delete cleanProps.whileInView;
    delete cleanProps.viewport;
    delete cleanProps.animate;
    delete cleanProps.transition;
    delete cleanProps.whileHover;
    delete cleanProps.exit;
    delete cleanProps.custom;

    return (
      <Tag
        style={style}
        className={`${className || ''} reveal-on-scroll`}
        {...cleanProps}
      >
        {children}
      </Tag>
    );
  };
};

export const m = new Proxy({}, {
  get: function(target, prop) {
    if (!target[prop]) {
      target[prop] = createMotionComponent(prop);
    }
    return target[prop];
  }
});
export const loadFramerFeatures = null;
