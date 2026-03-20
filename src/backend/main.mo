import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Category = {
    id : Nat;
    name : Text;
  };

  type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    categoryId : Nat;
    available : Bool;
  };

  type OrderItem = {
    menuItemId : Nat;
    name : Text;
    price : Float;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    mobileNumber : Text;
    carModel : Text;
    carColour : Text;
    items : [OrderItem];
    status : Text;
    createdAt : Int;
    subtotal : Float;
    tax : Float;
    total : Float;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextCategoryId = 1;
  var nextMenuItemId = 1;
  var nextOrderId = 1;

  let categories = Map.empty<Nat, Category>();
  let menuItems = Map.empty<Nat, MenuItem>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Category {
    public func compareById(a : Category, b : Category) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module MenuItem {
    public func compareById(a : MenuItem, b : MenuItem) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  func seedStarterCategoriesAndMenu() {
    let starterCategories = [
      "Starters",
      "Mains",
      "Breads",
      "Rice & Biryani",
      "Beverages",
      "Desserts",
    ];

    for (name in starterCategories.values()) {
      let category = {
        id = nextCategoryId;
        name;
      };
      categories.add(nextCategoryId, category);
      nextCategoryId += 1;
    };

    let starterMenuItems = [
      ("Gobi 65", "Spicy fried cauliflower", 120.0, 1, true),
      ("Paneer Tikka", "Grilled cottage cheese", 180.0, 1, true),
      ("Veg Spring Roll", "Crispy vegetable rolls", 110.0, 1, true),
      ("Crispy Corn", "Fried corn kernels", 130.0, 1, true),
      ("Masala Papad", "Spiced papadum", 60.0, 1, true),
      ("Paneer Butter Masala", "Cottage cheese in tomato gravy", 200.0, 2, true),
      ("Dal Makhani", "Creamy lentils", 160.0, 2, true),
      ("Mix Veg Curry", "Assorted vegetable curry", 150.0, 2, true),
      ("Palak Paneer", "Spinach with cottage cheese", 190.0, 2, true),
      ("Chana Masala", "Spicy chickpea curry", 140.0, 2, true),
      ("Veg Kolhapuri", "Spicy vegetable curry", 170.0, 2, true),
      ("Butter Naan", "Buttery flatbread", 40.0, 3, true),
      ("Tandoori Roti", "Oven-baked flatbread", 30.0, 3, true),
      ("Garlic Naan", "Garlic-flavored naan", 50.0, 3, true),
      ("Paratha", "Layered flatbread", 45.0, 3, true),
      ("Veg Biryani", "Spiced rice with vegetables", 180.0, 4, true),
      ("Jeera Rice", "Cumin-flavored rice", 100.0, 4, true),
      ("Veg Fried Rice", "Stir-fried rice with vegetables", 140.0, 4, true),
      ("Curd Rice", "Yogurt mixed with rice", 120.0, 4, true),
      ("Masala Chaas", "Spiced buttermilk", 60.0, 5, true),
      ("Mango Lassi", "Mango-flavored yogurt drink", 90.0, 5, true),
      ("Fresh Lime Soda", "Lemon soda", 70.0, 5, true),
      ("Filter Coffee", "Traditional South Indian coffee", 50.0, 5, true),
      ("Masala Chai", "Spiced tea", 40.0, 5, true),
      ("Gulab Jamun", "Sweet fried dumplings", 70.0, 6, true),
      ("Rasmalai", "Cottage cheese in sweetened milk", 90.0, 6, true),
      ("Kulfi", "Traditional Indian ice cream", 80.0, 6, true),
      ("Ice Cream", "Assorted flavors", 60.0, 6, true),
    ];

    for (item in starterMenuItems.values()) {
      let (name, description, price, categoryId, available) = item;
      let menuItem = {
        id = nextMenuItemId;
        name;
        description;
        price;
        categoryId;
        available;
      };
      menuItems.add(nextMenuItemId, menuItem);
      nextMenuItemId += 1;
    };
  };

  seedStarterCategoriesAndMenu();

  func calculateTotals(items : [OrderItem]) : (Float, Float, Float) {
    var subtotal = 0.0;
    for (item in items.vals()) {
      subtotal := subtotal + (item.price * item.quantity.toFloat());
    };

    let tax = subtotal * 0.05;
    let total = subtotal + tax;
    (subtotal, tax, total);
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public APIs (no authentication required - accessible to guests)
  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort(MenuItem.compareById);
  };

  public query func getCategories() : async [Category] {
    categories.values().toArray().sort(Category.compareById);
  };

  public shared func placeOrder(
    mobileNumber : Text,
    carModel : Text,
    carColour : Text,
    items : [OrderItem]
  ) : async Nat {
    let (subtotal, tax, total) = calculateTotals(items);

    let order : Order = {
      id = nextOrderId;
      mobileNumber;
      carModel;
      carColour;
      items;
      status = "Received";
      createdAt = Time.now();
      subtotal;
      tax;
      total;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  // Admin-only APIs
  public query ({ caller }) func getOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray().sort(
      func(a, b) {
        Int.compare(b.createdAt, a.createdAt);
      }
    );
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          mobileNumber = order.mobileNumber;
          carModel = order.carModel;
          carColour = order.carColour;
          items = order.items;
          status;
          createdAt = order.createdAt;
          subtotal = order.subtotal;
          tax = order.tax;
          total = order.total;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func addMenuItem(
    name : Text,
    description : Text,
    price : Float,
    categoryId : Nat,
    available : Bool,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {};
    };

    let menuItem : MenuItem = {
      id = nextMenuItemId;
      name;
      description;
      price;
      categoryId;
      available;
    };

    menuItems.add(nextMenuItemId, menuItem);
    nextMenuItemId += 1;
    menuItem.id;
  };

  public shared ({ caller }) func updateMenuItem(
    id : Nat,
    name : Text,
    description : Text,
    price : Float,
    categoryId : Nat,
    available : Bool,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {};
    };

    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?_) {
        let updatedMenuItem : MenuItem = {
          id;
          name;
          description;
          price;
          categoryId;
          available;
        };
        menuItems.add(id, updatedMenuItem);
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    menuItems.remove(id);
  };

  public shared ({ caller }) func addCategory(name : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let category : Category = {
      id = nextCategoryId;
      name;
    };

    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category.id;
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    categories.remove(id);
  };
};
