const mongoose = require("mongoose");   
    
    const validateCustomerData = (data) => {
    const { name, email, totalSpends, maxVisits, lastVisit } = data;
    const errors = [];
  
    if (!name || typeof name !== 'string') {
      errors.push("Invalid or missing 'name'");
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Invalid or missing 'email'");
    }
    if (totalSpends !== undefined && (typeof totalSpends !== 'number' || totalSpends < 0)) {
      errors.push("'totalSpends' must be a non-negative number");
    }
    if (maxVisits !== undefined && (typeof maxVisits !== 'number' || maxVisits < 0)) {
      errors.push("'maxVisits' must be a non-negative number");
    }
    if (lastVisit !== undefined && (typeof lastVisit !== 'number' || lastVisit < 0)) {
      errors.push("'lastVisit' must be a non-negative number");
    }
  
    return errors;
  };
  
    const validateOrderData = (data) => {
    const { customerId, products, totalAmount } = data;
    const errors = [];
  
    if (!customerId || typeof customerId !== 'string') {
      errors.push("Invalid or missing 'customerId'");
    }
    if (!Array.isArray(products) || products.length === 0) {
      errors.push("Invalid or missing 'products'");
    } else {
      products.forEach((product, index) => {
        if (!product.name || typeof product.name !== 'string') {
          errors.push(`Invalid or missing 'name' for product at index ${index}`);
        }
        if (typeof product.quantity !== 'number' || product.quantity <= 0) {
          errors.push(`Invalid 'quantity' for product at index ${index}`);
        }
        if (typeof product.price !== 'number' || product.price <= 0) {
          errors.push(`Invalid 'price' for product at index ${index}`);
        }
      });
    }
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      errors.push("Invalid or missing 'totalAmount'");
    }
  
    return errors;
  };



  const validateCommunicationLogData = (data) => {
    const { campaignName, campaignDescription, campaignSize, rules, logic, customers } = data;
    const errors = [];
  
    if (!campaignName || typeof campaignName !== 'string') {
      errors.push("Invalid or missing 'campaignName'");
    }
  
    if (!campaignDescription || typeof campaignDescription !== 'string') {
      errors.push("Invalid or missing 'campaignDescription'");
    }
  
    if (typeof campaignSize !== 'number' || campaignSize <= 0) {
      errors.push("Invalid or missing 'campaignSize'");
    }
  
    if (!Array.isArray(rules) || rules.length === 0) {
      errors.push("Invalid or missing 'rules'");
    } else {
      rules.forEach((rule, index) => {
        if (!rule.field || typeof rule.field !== 'string') {
          errors.push(`Invalid or missing 'field' for rule at index ${index}`);
        }
        if (!rule.operator || !["=", ">", "<"].includes(rule.operator)) {
          errors.push(`Invalid or missing 'operator' for rule at index ${index}`);
        }
        if (typeof rule.value !== 'string' && typeof rule.value !== 'number') {
          errors.push(`Invalid or missing 'value' for rule at index ${index}`);
        }
      });
    }
  
    if (!logic || !["AND", "OR"].includes(logic)) {
      errors.push("Invalid or missing 'logic'");
    }
  
    if (customers && Array.isArray(customers)) {
      customers.forEach((customer, index) => {
        if (!customer.customer || !mongoose.Types.ObjectId.isValid(customer.customer)) {
          errors.push(`Invalid or missing 'customer' at index ${index}`);
        }
        if (!customer.status || !["PENDING", "SENT", "FAILED"].includes(customer.status)) {
          errors.push(`Invalid or missing 'status' for customer at index ${index}`);
        }
      });
    } else {
      errors.push("Invalid or missing 'customers'");
    }
  
    return errors;
  };
  

  module.exports={validateCustomerData,validateOrderData,validateCommunicationLogData};