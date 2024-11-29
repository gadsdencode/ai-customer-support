// app/utils/actionUtils.ts
export const actionRequiresApproval = (action: string): boolean => {
    const actionsRequiringApproval = [
      'delete',
      'update',
      'critical_operation',
      'sensitive_data_access',
    ];
    return actionsRequiringApproval.includes(action);
  };