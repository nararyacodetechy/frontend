import { RoleEnum } from '@/types/role';

type NavLink = {
  label: string;
  getHref: (role: RoleEnum) => string;
};

export const NAV_CONFIG: Partial<Record<RoleEnum, NavLink[]>> = {
  [RoleEnum.ADMIN]: [
    { label: 'Dashboard', getHref: () => '/dashboard/admin' },
    { label: 'Account', getHref: () => '/dashboard/admin/account' },
  ],
  [RoleEnum.SALES]: [
    { label: 'Dashboard', getHref: () => '/dashboard/sales' },
    { label: 'Projects', getHref: () => '/dashboard/sales/Projects' },
    { label: 'Task Management', getHref: () => '/dashboard/sales/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/sales/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/sales/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/sales/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/sales/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/sales/notification' },
    { label: 'Account', getHref: () => '/dashboard/sales/account' },
  ],
  [RoleEnum.MARKETING]: [
    { label: 'Dashboard', getHref: () => '/dashboard/marketing' },
    { label: 'Projects', getHref: () => '/dashboard/marketing/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/marketing/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/marketing/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/marketing/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/marketing/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/marketing/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/marketing/notification' },
    { label: 'Account', getHref: () => '/dashboard/marketing/account' },
  ],
  [RoleEnum.PRODUCT_MANAGER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/product-manager' },
    { label: 'Orders', getHref: () => '/dashboard/product-manager/orders' },
    { label: 'Projects', getHref: () => '/dashboard/product-manager/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/product-manager/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/product-manager/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/product-manager/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/product-manager/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/product-manager/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/product-manager/notification' },
    { label: 'Account', getHref: () => '/dashboard/product-manager/account' },
  ],
  [RoleEnum.DEVELOPER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/developer' },
    { label: 'Projects', getHref: () => '/dashboard/developer/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/developer/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/developer/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/developer/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/developer/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/developer/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/developer/notification' },
    { label: 'Account', getHref: () => '/dashboard/developer/account' },
  ],
  [RoleEnum.DEVOPS]: [
    { label: 'Dashboard', getHref: () => '/dashboard/devops' },
    { label: 'Projects', getHref: () => '/dashboard/devops/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/devops/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/devops/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/devops/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/devops/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/devops/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/devops/notification' },
    { label: 'Account', getHref: () => '/dashboard/devops/account' },
  ],
  [RoleEnum.DESIGNER]: [
    { label: 'Dashboard', getHref: () => '/dashboard/designer' },
    { label: 'Projects', getHref: () => '/dashboard/designer/projects' },
    { label: 'Task Management', getHref: () => '/dashboard/designer/task-management' },
    { label: 'Schedule', getHref: () => '/dashboard/designer/schedule' },
    { label: 'Team & Role', getHref: () => '/dashboard/designer/team-role' },
    { label: 'Docs', getHref: () => '/dashboard/designer/docs' },
    { label: 'My Wallet', getHref: () => '/dashboard/designer/my-wallet' },
    { label: 'Notification', getHref: () => '/dashboard/designer/notification' },
    { label: 'Account', getHref: () => '/dashboard/designer/account' },
  ],
};
