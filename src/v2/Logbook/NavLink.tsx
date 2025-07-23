import { NavLinkProps, NavLink as ReactRouterNavLink } from 'react-router-dom'

export function NavLink(
  props: NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
) {
  return (
    <ReactRouterNavLink
      {...props}
      className={({ isActive }) => (isActive ? 'text-active' : 'text-inactive')}
    />
  )
}
