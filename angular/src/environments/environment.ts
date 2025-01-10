// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    stripe: {
        publicKey: 'pk_test_51LTqsAIh16kWS6F1ZkzvaPH4WdNYHz8jJyTx9KZF0Ruhpv6yIDnZ6LzEPU0zpqXRwjOx9IVbkZPdCCzl6vZzGhqV00JE0zZMiz',
    }
};

export const apiUrl = 'https://app.fbasystem.com/api';
export const imagePath = 'https://app.fbasystem.com/';

// export const apiUrl = 'http://18.221.124.139:3000/api';
// export const imagePath = 'http://18.221.124.139:3000';

// export const apiUrl = 'http://localhost:3000/api';
// export const imagePath = 'http://localhost:3000';

// export const amazon_url = 'https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.feb2b02a-b5b2-46ed-a87c-2c377870e058'

// export const amazon_url = 'https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.feb2b02a-b5b2-46ed-a87c-2c377870e058&scope=&redirect_uri=https://knight.mangoitsol.com/user/configure-platform&response_type=code&state=spapi65085a38572303.68350031'

export const amazon_url = 'https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.bbd29489-5713-48a1-872b-9bf45313f592&scope=&redirect_uri=https://app.fbasystem.com/user/configure-platform&response_type=code&state=spapi65085a38572303.68350031&version=beta'
