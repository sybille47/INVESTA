import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Label, Input } from '../ui/inputForm';
import Button from '../ui/button';
import { useProfile } from '../../hooks/useProfile';
import toast from 'react-hot-toast';
import { maskIBAN } from '../../utils/maskUtils';
import '/src/index.css';

function ProfileForm() {
  const { profileData, loading, error, updateProfile, setProfileData } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {

    const result = await updateProfile(profileData);
    if (result.success) {
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <div className="header-content">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          <p className="page-subtitle">Manage your personal information and account details</p>
        </div>

        {!isEditing && (
          <Button
          className="header-edit-btn"
          value="Edit Profile"
          onClick={() => setIsEditing(true)}
          variant="primary"
          />
        )}
        {/* {!isEditing && ( */}
          {/* <Button
            className="action-btn secondary"
            value="Delete Profile" */}
            {/* // onClick={() => setIsEditing(true)} */}
            {/* variant="secondary" */}
          {/* /> */}
        {/* )} */}



      </div>

      <div className="profile-content-wrapper">
        {/* User Name Card */}
        <Card className="modern-profile-card">
          <CardHeader className="modern-card-header">
            <div className="card-header-content">
              <div className="card-icon-wrapper personal-icon">
                <div className="card-icon-wrapper fund-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                  </div>
                  <div>
                    <CardTitle className="modern-card-title">User Name</CardTitle>
                    <p className="card-description">Your user name cannot be changed</p>
                    </div>
                    </div>
                    </CardHeader>

        <CardContent
        className="modern-card-content">
        <div className="form-grid two-column">
          <div className="modern-form-field">
            <Label className="modern-label" htmlFor="user-name"
            > User Name
            </Label> <div className="input-wrapper disabled">
              <Input className="modern-input" id="user-name" name="user-name" type="text" value={profileData.email_address || ''} onChange={handleInputChange} disabled />
              <div className="disabled-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"/>
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"/>
                    </svg>
                    </div>
                  </div>
                </div>
                  </div>
                  </CardContent>
                  </Card>




        {/* Personal Information Card */}
        <Card className="modern-profile-card">
          <CardHeader className="modern-card-header">
            <div className="card-header-content">
              <div className="card-icon-wrapper personal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
                  </svg>
                  </div>
                  <div>
                    <CardTitle className="modern-card-title">Personal Information</CardTitle>
                    </div>
                    </div>
                    </CardHeader>

        <CardContent
        className="modern-card-content">
        <div className="form-grid two-column">
          <div className="modern-form-field">
            <Label className="modern-label" htmlFor="first_name"
            > First Name
            <span className="required-indicator">*</span>
            </Label> <div className="input-wrapper disabled">
              <Input className="modern-input" id="first_name" name="first_name" type="text" value={profileData.first_name || ''} onChange={handleInputChange} disabled={!isEditing} />
              <div className="disabled-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"/>
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"/>
                    </svg>
                    </div>
                  </div>
                </div>
          <div
            className="modern-form-field">
            <Label className="modern-label" htmlFor="last_name"
            > Last Name <span className="required-indicator">*</span>
            </Label>
            <div className="input-wrapper disabled">
              <Input
                className="modern-input"
                id="last_name"
                name="last_name"
                type="text"
                value={profileData.last_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                />
                <div className="disabled-overlay">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"/>
                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"/>
                    </svg>
                  </div>
                  </div>
                  </div>
                  </div>
                  </CardContent>
                  </Card>
                  {/* Address Card */}
                  <Card className="modern-profile-card">
                    <CardHeader className="modern-card-header">
                      <div className="card-header-content">
                        <div className="card-icon-wrapper address-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"/>
                              <path
                                d="M9 22V12h6v10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"/>
                              </svg>
                            </div>
                          <div>
                        <CardTitle
                          className="modern-card-title">Address</CardTitle>
                          <p className="card-description">Your residential address</p>
                          </div>
                          </div>
                          </CardHeader>
                          <CardContent
                            className="modern-card-content">
                              <div className="form-grid">
                                <div className="form-grid two-column">
                                  <div className="modern-form-field">
                                    <Label className="modern-label" htmlFor="street">Street</Label>
                                    <Input className="modern-input"
                                      id="street"
                                      name="street"
                                      type="text"
                                      value={profileData.street || ''}
                                      onChange={handleInputChange}
                                      disabled={!isEditing} /> </div>
                                      <div className="modern-form-field">
                                        <Label
                                          className="modern-label"
                                          htmlFor="house_no">House No</Label>
                                          <Input
                                            className="modern-input"
                                            id="house_no"
                                            name="house_no"
                                            type="text"
                                            value={profileData.house_no || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing} />
                                          </div>
                                        </div>
                                        <div className="form-grid two-column">
                                      <div className="modern-form-field">
                                    <Label className="modern-label" htmlFor="zip_code">Postal Code</Label>
                                  <Input className="modern-input"
                                    id="zip_code"
                                    name="zip_code"
                                    type="text"
                                    value={profileData.zip_code || ''}
                                    onChange={handleInputChange} disabled={!isEditing} />
                                  </div>
                                  <div className="modern-form-field">
                                    <Label className="modern-label" htmlFor="town">City</Label>
                                    <Input
                                      className="modern-input"
                                      id="town" name="town"
                                      type="text"
                                      value={profileData.town || ''}
                                      onChange={handleInputChange}
                                      disabled={!isEditing} />
                                      </div>
                                      </div>
                                      <div className="modern-form-field">
                                        <Label className="modern-label" htmlFor="country">Country</Label>
                                        <Input
                                        className="modern-input"
                                        id="country"
                                        name="country"
                                        type="text"
                                        value={profileData.country || ''}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} />
                                        </div>
                                        </div>
                                        </CardContent>
                                        </Card>



        {/* Bank Account Details Card */}
        <Card className="modern-profile-card">
          <CardHeader className="modern-card-header">
            <div className="card-header-content">
              <div className="card-icon-wrapper bank-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="modern-card-title">Bank Account Details</CardTitle>
                <p className="card-description">Account must be in your name</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="modern-card-content">
            <div className="form-grid">
              {/* Account Holder */}
              <div className="modern-form-field">
                <Label className="modern-label" htmlFor="holder">
                  Account Holder
                </Label>
                <Input
                  className="modern-input"
                  id="holder"
                  name="holder"
                  type="text"
                  value={`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()}
                  onChange={handleInputChange} disabled
                />
              </div>

              {/* IBAN masking*/}
              <div className="modern-form-field">
                <Label className="modern-label" htmlFor="iban">
                  IBAN <span className="required-indicator">*</span>
                </Label>
                <Input
                  className="modern-input monospace"
                  id="iban"
                  name="iban"
                  type="text"
                  value={
                    isEditing
                      ? profileData.iban || ''
                      : maskIBAN(profileData.iban)
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
                {!isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Only the first and last 4 characters are shown for security.
                  </p>
                )}
              </div>

              <div className="form-grid two-column">
                <div className="modern-form-field">
                  <Label className="modern-label" htmlFor="bank_name">Bank Name</Label>
                  <Input
                    className="modern-input"
                    id="bank_name"
                    name="bank_name"
                    type="text"
                    value={profileData.bank_name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="modern-form-field">
                  <Label className="modern-label" htmlFor="bic">BIC</Label>
                  <Input
                    className="modern-input monospace"
                    id="bic"
                    name="bic"
                    type="text"
                    value={profileData.bic || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="COBADEFFXXX"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <div className="form-actions">
            <Button
              className="action-btn secondary"
              value="Cancel"
              onClick={handleCancel}
              variant="secondary"
            />
            <Button
              className="action-btn primary"
              value="Save Changes"
              onClick={handleSave}
              variant="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileForm;
