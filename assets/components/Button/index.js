import PropTypes from 'prop-types';
const classnames = require('classnames');

const Button = ({
  children,
  className,
  type,
  label,
  disabled,
  darkBg,
  linkBg,
  iconBg,
  ...rest
}) => {
  return (
    <button
      className={classnames(styles.Button, className, {
        [styles.DarkBg]: darkBg,
        [styles.LinkBg]: linkBg,
        [styles.IconBg]: iconBg
      })}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {label || children}
    </button>
  );
};

Button.defaultProps = {
  darkBg: false,
  disabled: false,
  type: 'button'
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  darkBg: PropTypes.bool,
  iconBg: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  linkBg: PropTypes.bool
};

export default Button;
