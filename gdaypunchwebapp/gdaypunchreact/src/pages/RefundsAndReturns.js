import React from "react";
import styled from "styled-components";
import AboutSection from "components/about";
import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const ContentContainer = styled.div`
  white-space: pre-line;
  text-align: start;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  margin-bottom: 2em;
`;

function RefundsAndReturns(props) {
  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Refunds and Returns Policy</SectionTitle>
        <ContentContainer>
          {`
      REFUND POLICY

      Gday Punch Pty Ltd
      This Refund Policy ("Policy") applies to all purchases from us, unless stated otherwise.
      
      
      (1) CUSTOMER SATISFACTION IS OUR PRIORITY
      
      At Gday Punch Pty Ltd, customer satisfaction is our priority.
      We offer refunds, repairs and replacements in accordance with the Australian Consumer Law and on the terms set out in this Policy.
      Any benefits set out in this Policy may apply in addition to consumer's rights under the Australian Consumer Law.
      Please read this Policy before making a purchase, so that you understand your rights as well as what you can expect from us in the event that you are not happy with your purchase.
      
      ​
      (2) AUSTRALIAN CONSUMER LAW
      
      (a) Under the Australian Consumer Law:
      Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures with the service, you are entitled:
      - to cancel your service contract with us; and
      - to a refund for the unused portion, or to compensation for its reduced value.
      You are also entitled to choose a refund or replacement for major failures with goods. If a failure with the goods or a service does not amount to a major failure, you are entitled to have the failure rectified in a reasonable time. If this is not done you are entitled to a refund for the goods and to cancel the contract for the service and obtain a refund of any unused portion. You are also entitled to be compensated for any other reasonably foreseeable loss or damage from a failure in the goods or service.
      (b) We offer refunds, repairs, and replacements in accordance with the Australian Consumer Law.
      (c) The Australian Consumer Law provides a set of Consumer Guarantees which protect consumers when they buy products and services.
      (d) If the Australian Consumer Law applies, then we cannot avoid the Consumer Guarantees which it provides. If there is an inconsistency between this Policy and the Australian Consumer Law, the Australian Consumer Law will prevail.
      (e) Further information about the Australian Consumer Law and these Consumer Guarantees is available from the website of the Australian Competition and Consumer Commission.
      (f) If a product or service which you purchased from us has a major failure (as defined in the Australian Consumer Law) then you may be entitled to a replacement or refund. You may also be entitled to compensation for any reasonably foreseeable loss or damage resulting from that major failure.
      (g) If a product or service which you purchased from us has a failure which does not amount to a major failure (as defined in the Australian Consumer Law) then you may still be entitled to have the goods repaired or replaced.
      
      
      (3) CHANGE OF MIND
      
      We do not offer any refund if you simply change your mind, or find the same product or service cheaper elsewhere.
      
      
      (4) PRODUCTS DAMAGED DURING DELIVERY
      
      In the event that a product which you ordered is damaged during delivery:
      (a) Please contact us as soon as possible.
      (b) Any damaged product must be returned in the condition it was in when you received it, together with any packaging and other items which you received with the damaged product.
      (c) We will organise to repair the damaged product or to collect it and replace it with an equivalent product, or to provide a refund, provided that you contact us within the following time from the date you received the product: 5
      
      
      (5) EXCEPTIONS
      
      Notwithstanding the other provisions of this Policy, we may refuse to provide a repair, replacement or refund for a product or service you purchased if:
      (a) You misused the said product in a way which caused the problem.
      (b) You knew or were made aware of the problem(s) with the product or service before you purchased it.
      (c) You asked for a service to be done in a certain manner, or you asked for alterations to a product, against our advice, or you were unclear about what you wanted.
      (d) Any other exceptions apply under the Australian Consumer Law.
      
      
      (6) SHIPPING COSTS FOR RETURNS
      (a) In the event that a product you purchased fails to meet one or more Consumer Guarantees under the Australian Consumer Law we will bear any costs of shipping the said product (the "Returned Product") back to us, as well as any costs of shipping any replacement product to you.
      (b) If the Returned Product can easily be posted or returned, then you are responsible for organising for the Returned Product to be returned to us. If the Returned Product is eligible for a repair, replacement or refund under the terms of this Policy (including under the Australian Consumer Law) then we will reimburse you for the reasonable postage, shipping or transportation costs for the Returned Product.
      (c) If the Returned Product is too large, too heavy, or otherwise too difficult to be removed and returned by you, and is believed to be eligible for a repair, replacement or refund under the terms of this Policy (including under the Australian Consumer Law), then we will organise for the postage, shipping, transportation or collection of the Returned Product, at our cost.
      (d) In the event that we organise and pay for the inspection, postage, shipping, transportation or collection of a Returned Product, and it turns out not to be eligible for a repair, replacement or refund under the terms of this Policy (including under the Australian Consumer Law), then you will be required to pay the costs of any inspection, postage, shipping, transportation or collection of the Returned Product.
      
      
      (7) REFURBISHED PRODUCTS
      
      Goods presented for repair may be replaced by refurbished goods of the same type rather than being repaired. Refurbished parts may be used to repair the goods.
      
      
      (8) ASSISTANCE FROM MANUFACTURERS
      
      (a) In some cases, manufacturers may provide assistance in relation to their products, and they may be able to resolve your issue more quickly.
      (b) In some cases, manufacturers may provide warranties for their products, which go beyond the Consumer Guarantees under the Australian Consumer Law or any other rights which you may have under this Policy.
      (c) You are not obliged to contact the manufacturer directly in order to seek a repair, replacement or refund. However, you may do so if you wish.
      
      
      (9) RESPONSE TIME
      
      We aim to process any requests for repairs, replacements or refunds within 5 days of having received them.
      
      
      (10) HOW TO RETURN PRODUCTS
      
      (a) You may contact us to discuss a return using the details at the end of this Policy.
      (b) We will pay any refunds in the same form as the original purchase or to the same account or credit card as was used to make the original purchase, unless otherwise determined in our sole discretion.
      (c) You must provide proof of purchase in order to be eligible for a refund, repair or replacement.
      (d) You may be required to present a government issued identification document in order to be eligible for a refund, repair or replacement.
      
      
      (11) CONTACT US
      
      If you wish to speak to us about this Policy or about any refund, repairs or replacements, you may contact us at:
      info@gdaypunch.com
      `}
        </ContentContainer>
      </FeaturedSection>
    </App>
  );
}

export default RefundsAndReturns;
