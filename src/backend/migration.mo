import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Order "mo:core/Order";

module {
  type OldCategory = {
    id : Nat;
    name : Text;
  };

  type OldMenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categoryId : Nat;
    available : Bool;
  };

  type OldAddon = {
    id : Nat;
    name : Text;
    price : Float;
    menuItemId : ?Nat;
  };

  type OldOrderItemAddon = {
    addonId : Nat;
    name : Text;
    price : Float;
  };

  type OldOrderItem = {
    menuItemId : Nat;
    name : Text;
    price : Float;
    quantity : Nat;
    addons : [OldOrderItemAddon];
  };

  type OldOrder = {
    id : Nat;
    mobileNumber : Text;
    carModel : Text;
    carColour : Text;
    items : [OldOrderItem];
    status : Text;
    createdAt : Int;
    subtotal : Float;
    tax : Float;
    total : Float;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    nextCategoryId : Nat;
    nextMenuItemId : Nat;
    nextAddonId : Nat;
    nextOrderId : Nat;
    phonepeUpiId : Text;
    paytmUpiId : Text;
    categories : Map.Map<Nat, OldCategory>;
    menuItems : Map.Map<Nat, OldMenuItem>;
    addons : Map.Map<Nat, OldAddon>;
    orders : Map.Map<Nat, OldOrder>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
