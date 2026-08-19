import { useEffect, useRef } from 'react';

export default function Dropdown({
  current,
  open,
  onToggle,
  options,
  onSelect,
  active,
  variant = 'light',
  style,
  className = '',
  onClose,
}) {
  const isDark = variant === 'dark';
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [open, onClose]);

  // Options can be plain strings or { value, label } objects.
  const normalizeOpt = (o) => (typeof o === 'object' && o !== null ? o : { value: o, label: o });
  const currentLabel = (() => {
    if (typeof current === 'string') {
      const match = options.map(normalizeOpt).find((o) => o.value === current);
      return match ? match.label : current;
    }
    return current;
  })();

  return (
    <div
      ref={rootRef}
      className={`dropdown${isDark ? ' dropdown--dark' : ''}${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        className="dropdown__btn"
        onClick={onToggle}
        style={style}
        aria-expanded={open}
      >
        <span className="dropdown__label">{currentLabel}</span>
        <span className="dropdown__chev" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="dropdown__menu" role="listbox">
          {options.map((o) => {
            const { value, label } = normalizeOpt(o);
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={value === current}
                className={`dropdown__option${value === current ? ' is-active' : ''}`}
                onClick={() => onSelect(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
