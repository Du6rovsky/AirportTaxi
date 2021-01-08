import http from '@/core/http';
import {CONFIG} from '@/config/config';
import Order from "@/core/entities/Order.entity";

class OrderService {
  public createOrder(data: Order) {
    return http.post(CONFIG.api + `/posts`, data);
  }
}

export const orderService = new OrderService();
