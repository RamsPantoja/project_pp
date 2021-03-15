import { RESTDataSource } from "apollo-datasource-rest";

class MercadoPagoAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://api.mercadopago.com/';
    }

    willSendRequest(request) {
        request.headers.set('Authorization', `Bearer ${process.env.ACCESS_TOKEN_MP}`);
    }
  
    //Hace una peticion por metodo POST a la url: https://api.mercadopago.com/preapproval_plan, para crear un plan de suscrpción.
    async createPreapprovalPlan(preapproval_preference) {
      return this.post(
        `preapproval_plan`, // path
        preapproval_preference, // request body
      );
    }
}

export default MercadoPagoAPI;
  