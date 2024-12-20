

export const rolesConfig = {
  SuperAdmin: ['SUPER_ADMIN'],
  Admin: ['ADMIN', 'SUPER_ADMIN'],
  OperatorDelivery: ['OPERATOR', 'DELIVERY', 'ADMIN', 'SUPER_ADMIN'],
}