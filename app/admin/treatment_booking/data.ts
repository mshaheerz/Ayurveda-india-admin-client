const columns = [
    // { name: "ID", uid: "id" },
    { name: "Name", uid: "name", sortable: true },
    { name: "Email", uid: "email_id", sortable: true },
    { name: "phone", uid: "phone", sortable: true },
    { name: "price", uid: "treatment_price", sortable: true },
    { name: "Treatment", uid: "treatment", sortable: true },
    { name: "action", uid: "status" },
  ];
  
  const statusOptions = [
    { name: "Active", uid: 0 },
    { name: "Inactive", uid: 1 },
  ];
  
  const bookings = [
    {
        "id": "834612a2-1790-49d6-bf8b-658571a97471",
        "course": null,
        "treatment": {
            "id": "15bd292b-8ff3-4a22-94c1-94bc6cbadaa3",
            "name": "Treatments for Skin Disorders",
            "description": "Most skin disorders arise due to incorrect diet and lifestyle choices, at The Ayurvedic Clinic we can guide you back to health with the correct dietary regime to help relieve you from your particular disorder.\r\n\r\nThe Ancient science of Ayurveda is becoming more popular today due to the fact that it gets to the root cause of the disorder by dealing with the fundamentals of what you eat and what kind of lifestyle you lead to understand the root cause of you skin disorder – after all, you are what you eat!",
            "location": "Londan",
            "duration": 50,
            "duration_type": "weeks",
            "seats_available": 300,
            "actual_price": "99.0000",
            "offer_persentage": 10,
            "grant_price": "89.1000",
            "why_treatment1": "Holistic, bespoke & natural\r\nAyurveda regards each individual as unique and so recognises the need for a customised approach to balance and true well-being. We are each a combination of three doshas, Vata, Pitta and Kapha, with one or two being the predominant one. It the specific make up of our constitution or Prakriti, taken together with many other factors such as genetic background, geography, diet, lifestyle, relationships, work which determines our unique nature. Our specific constitutional make-up is as unique to us as our DNA code. Imbalances",
            "why_treatment2": "",
            "why_treatment3": "",
            "is_published": true,
            "created_by": "df322df4-9047-4f53-810e-2d3f09978c65",
            "updated_by": "df322df4-9047-4f53-810e-2d3f09978c65",
            "status": 1,
            "created_at": "2024-05-02T14:42:44.218161Z",
            "updated_at": "2024-05-02T14:48:52.964865Z"
        },
        "bookinguserinformations": {
            "id": "14d9008d-6560-4cb9-80de-b291d83c1161",
            "email_id": "pes@mailinator.com",
            "phone_number": "07592978136",
            "first_name": "muhammed",
            "last_name": "M",
            "gender": "male",
            "age": 89,
            "country_code": null,
            "address_line_1": "madathingal house south puthalam Areekode Post Office malappuram kerala",
            "address_line_2": "madathingal house south puthalam Areekode Post Office malappuram kerala",
            "country": "India",
            "state": "Kerala",
            "city": "Malappuram",
            "zip_code": "673639",
            "status": 1,
            "created_by": null,
            "created_at": "2024-05-11T07:34:32.161214Z",
            "updated_at": "2024-05-11T07:34:32.161244Z"
        },
        "booking_user_type": "unknown",
        "booking_date": "2024-05-11T07:34:30.930000Z",
        "other_information": "",
        "booking_type": "treatment",
        "status": 1,
        "created_by": null,
        "created_at": "2024-05-11T07:34:32.166737Z",
        "updated_at": "2024-05-11T07:34:32.166752Z",
        "user": null
    }
    
  
    
  ];
  
  export { columns, bookings, statusOptions };
  


  