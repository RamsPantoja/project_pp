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

    async getUsersInSuscription(limit, offset, preapproval_plan_id) {
      const data = await this.get(`preapproval/search`, {
        limit: limit,
        offset: offset,
        preapproval_plan_id: preapproval_plan_id,
        end_date: 'NOW',
        criteria: 'desc'
      });
      return data;
    }

    async getPreapproval(preapproval_id, email) {
      const data = await this.get(`preapproval/search`, {
        id: preapproval_id,
        payer_email: email
      })

      return data;
    }
}

export default MercadoPagoAPI;
  