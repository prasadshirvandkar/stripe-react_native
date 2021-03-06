//
//  Images.swift
//  StripeiOS
//
//  Created by Yuki Tokuhiro on 5/19/21.
//  Copyright © 2021 Stripe, Inc. All rights reserved.
//

import Foundation
@_spi(STP) import StripeUICore

// TODO(yuki|https://jira.corp.stripe.com/browse/MOBILESDK-309): Refactor STPImageLibrary's images to live here as well

/// The canonical set of all image files in the SDK.
/// This helps us avoid duplicates and automatically test that all images load properly
/// Raw value is the image file name. We use snake case to make long names easier to read.
enum Image: String, CaseIterable, ImageMaker {
    typealias BundleLocator = StripeBundleLocator

    /// https://developer.apple.com/apple-pay/marketing/
    case apple_pay_mark = "apple_pay_mark"

    // Payment Method Type images
    case pm_type_afterpay = "icon-pm-afterpay"
    case pm_type_bancontact = "icon-pm-bancontact"
    case pm_type_card = "icon-pm-card"
    case pm_type_eps = "icon-pm-eps"
    case pm_type_giropay = "icon-pm-giropay"
    case pm_type_ideal = "icon-pm-ideal"
    case pm_type_klarna = "icon-pm-klarna"
    case pm_type_p24 = "icon-pm-p24"
    case pm_type_sepa = "icon-pm-sepa"
    case pm_type_paypal = "icon-pm-paypal"
    case pm_type_link_instant_debit = "stp_icon_bank"

    // Icons/symbols
    case icon_checkmark = "icon_checkmark"
    case icon_chevron_left = "icon_chevron_left"
    case icon_lock = "icon_lock"
    case icon_menu = "icon_menu"
    case icon_plus = "icon_plus"
    case icon_x = "icon_x"

    // Link
    case back_button = "back_button"
    case icon_cancel = "icon_cancel"
    case icon_add_bordered = "icon_add_bordered"
    case link_logo = "link_logo"
    case icon_link_toast_success = "icon_link_toast_success"
}
